import ticketService from "../tickets-service";
import hotelRepository from "@/repositories/hotel-repository";

import { notFoundError, conflictError } from "@/errors";
import { exclude } from "@/utils/prisma-utils";
import { Hotel, Room, Booking } from "@prisma/client";

async function getHotels(userId: number) {
  const userTicked = await ticketService.getTicketByUserId(userId);

  if(!userTicked) {
    throw notFoundError();
  }

  if(!userTicked.TicketType.includesHotel) throw notFoundError();
    
  if(userTicked.status === "RESERVED") throw conflictError("Paid firts engraçadinho! "); 
    
  if(userTicked.TicketType.isRemote) throw conflictError("Tá em casa!");

  const hotels = await hotelRepository.findHotels();
  return hotels;
}

async function getRoomByHotelId(hotelId: number) {
  const room = await hotelRepository.findRoomByHotelId(hotelId);

  if(!room) {
    throw notFoundError();
  }

  return room;
}

const hotelService = {
  getHotels,
  getRoomByHotelId
};

export default hotelService; 
