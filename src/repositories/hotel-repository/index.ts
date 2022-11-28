import { prisma } from "@/config";
import { Hotel, Room, Booking } from "@prisma/client";

async function findAllHotelsInfo() {
  return prisma.hotel.findMany();
}

async function findRoomByHotelId(hotelId: number) {
  return prisma.room.findMany({
    where: { hotelId: hotelId },
    
  });
}
export type PaymentParams = Omit<Hotel, "id" | "createdAt" | "updatedAt">

const hotelRepository = {
  findAllHotelsInfo,
  findRoomByHotelId
};

export default hotelRepository;
