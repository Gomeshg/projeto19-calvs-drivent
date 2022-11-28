import { prisma } from "@/config";
import { Hotel, Room, Booking } from "@prisma/client";

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findHotelById(hotelId: number) {
  return prisma.hotel.findFirst({
    where: { id: hotelId }
  });
}

async function findRoomByHotelId(hotelId: number) {
  return prisma.hotel.findMany({
    where: { id: hotelId },
    include: {
      Rooms: true
    }
  });
}

const hotelRepository = {
  findHotels,
  findHotelById,
  findRoomByHotelId
};

export default hotelRepository; 
