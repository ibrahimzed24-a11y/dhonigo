import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('--- Starting Seed ---');

    // 1. Seed Jetties
    const jetties = [
        'Male Jetty 1', 'Male Jetty 2', 'Male Jetty 3', 'Male Jetty 4',
        'Male Jetty 5', 'Male Jetty 6', 'Male Jetty 7', 'Male Jetty 8',
        'Male Jetty 9', 'Velana Airport'
    ];

    for (const name of jetties) {
        await prisma.jetty.upsert({
            where: { name },
            update: {},
            create: { name, latitude: 4.17, longitude: 73.51 },
        });
    }
    console.log('Jetties seeded.');

    // 2. Seed Islands
    const islands = [
        'Himmafushi', 'Huraa', 'Thulusdhoo', 'Maafushi', 'Gulhi',
        'Guraidhoo', 'Dhiffushi', 'Villingili', 'Hulhumale'
    ];

    for (const name of islands) {
        await prisma.island.upsert({
            where: { name },
            update: {},
            create: { name, latitude: 4.0, longitude: 73.0 },
        });
    }
    console.log('Islands seeded.');

    // 3. Seed Admin User
    const adminPhone = '+9600000000';
    await prisma.user.upsert({
        where: { phone: adminPhone },
        update: { role: 'ADMIN' },
        create: {
            phone: adminPhone,
            role: 'ADMIN',
        },
    });
    console.log('Admin user created.');

    // 4. Seed Operators & Sample Ferries
    for (let i = 1; i <= 5; i++) {
        const opPhone = `+960900000${i}`;
        const operator = await prisma.user.upsert({
            where: { phone: opPhone },
            update: { role: 'OPERATOR' },
            create: {
                phone: opPhone,
                role: 'OPERATOR',
            },
        });

        // Clean up old ferries for this op if any to avoid duplicates in seed
        await prisma.ferry.deleteMany({ where: { operatorId: operator.id } });

        await prisma.ferry.create({
            data: {
                operatorId: operator.id,
                route: `Male - ${islands[i % islands.length]}`,
                timing: '10:00',
                pricing: 52.5,
                totalSeats: 40,
                availableSeats: 35,
            },
        });
    }
    console.log('Operators and ferries seeded.');

    console.log('--- Seed Complete ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
