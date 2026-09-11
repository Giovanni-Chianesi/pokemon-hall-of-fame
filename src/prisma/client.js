// Um único cliente Prisma compartilhado por todo o app.
// Evita abrir várias conexões desnecessárias com o banco.
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;
