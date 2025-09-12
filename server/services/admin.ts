export const adminService = {
  async getAllOrganizations() {
    return prisma.organization.findMany({
      include: {
        members: {
          select: {
            id: true,
          },
        },
      },
    });
  },
};
