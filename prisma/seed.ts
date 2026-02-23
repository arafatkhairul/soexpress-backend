import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

enum Role {
    admin = 'admin',
    customer = 'customer',
    partner = 'partner',
    influencer = 'influencer',
    employee = 'employee'
}

async function main() {
    const password = await bcrypt.hash('password123', 10);

    const users = [
        { email: 'admin@soexpress.com', name: 'Admin User', password, role: Role.admin, isActive: true, avatar: 'https://i.pravatar.cc/150?u=admin' },
        { email: 'customer@example.com', name: 'John Customer', password, role: Role.customer, isActive: true, avatar: 'https://i.pravatar.cc/150?u=customer' },
        { email: 'partner@example.com', name: 'Sarah Partner', password, role: Role.partner, isActive: true, avatar: 'https://i.pravatar.cc/150?u=partner' },
        { email: 'influencer@example.com', name: 'Mike Influencer', password, role: Role.influencer, isActive: true, avatar: 'https://i.pravatar.cc/150?u=influencer' },
        { email: 'employee@soexpress.com', name: 'Alex Employee', password, role: Role.employee, isActive: true, avatar: 'https://i.pravatar.cc/150?u=employee' }
    ];

    console.log('Seeding Users...');
    const createdUsers: any = {};
    for (const u of users) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: { password: u.password, role: u.role, isActive: u.isActive },
            create: u,
        });
        createdUsers[user.email] = user;
        console.log(`Created user: ${user.email}`);
    }

    // Categories
    console.log('Seeding Categories...');
    const catNames = ['Electronics', 'Fashion', 'Home & Garden', 'Sports'];
    const categories: any[] = [];
    for (const name of catNames) {
        const slug = name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
        const cat = await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name, slug, description: `${name} products` }
        });
        categories.push(cat);
    }

    // Brands
    console.log('Seeding Brands...');
    const brandNames = ['Apple', 'Samsung', 'Nike', 'Sony'];
    const brands: any[] = [];
    for (const name of brandNames) {
        const slug = name.toLowerCase();
        const brand = await prisma.brand.upsert({
            where: { name },
            update: {},
            create: { name, slug }
        });
        brands.push(brand);
    }

    // Products
    console.log('Seeding Products...');
    const productsData = [
        { title: 'iPhone 15 Pro', price: 999.99, cat: 'Electronics', brand: 'Apple', sku: 'IPH-15-P' },
        { title: 'Samsung Galaxy S24', price: 899.99, cat: 'Electronics', brand: 'Samsung', sku: 'SAM-S24' },
        { title: 'Nike Air Max 2024', price: 129.99, cat: 'Fashion', brand: 'Nike', sku: 'NIK-AM-24' },
        { title: 'Sony WH-1000XM5', price: 349.99, cat: 'Electronics', brand: 'Sony', sku: 'SON-WH-5' },
    ];

    const products: any[] = [];
    for (const p of productsData) {
        const catId = categories.find(c => c.name === p.cat)?.id;
        const brandId = brands.find(b => b.name === p.brand)?.id;

        const prod = await prisma.product.upsert({
            where: { sku: p.sku },
            update: { price: p.price },
            create: {
                title: p.title,
                description: `Premium ${p.title}`,
                price: p.price,
                sku: p.sku,
                stock: 50,
                thumbnail: 'https://via.placeholder.com/150',
                images: ['https://via.placeholder.com/150'],
                tags: [p.cat, p.brand],
                dimensions: { w: 10, h: 5, d: 2 },
                categoryId: catId,
                brandId: brandId,
            }
        });
        products.push(prod);
    }

    // Orders
    console.log('Seeding Orders...');
    const customer = createdUsers['customer@example.com'];
    if (customer && products.length > 0) {
        // Only seed if no orders exist for this user to prevent massive duplicates
        const existingOrders = await prisma.order.findMany({ where: { userId: customer.id } });
        if (existingOrders.length === 0) {
            const order = await prisma.order.create({
                data: {
                    userId: customer.id,
                    totalAmount: products[0].price,
                    status: 'pending',
                    shippingAddress: { city: 'Istanbul', zip: '34400' },
                    items: {
                        create: [
                            {
                                productId: products[0].id,
                                quantity: 1,
                                price: products[0].price
                            }
                        ]
                    }
                }
            });
            console.log(`Created order: ${order.id}`);
        } else {
            console.log('Orders already seeded for customer.');
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
