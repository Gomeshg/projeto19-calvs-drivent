import ticketService from "../tickets-service";
import hotelRepository from "@/repositories/hotel-repository";

import { notFoundError, conflictError, noContentError } from "@/errors";
import { exclude } from "@/utils/prisma-utils";
import { Hotel, Room, Booking } from "@prisma/client";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getHotels(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw noContentError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  const ticketTypes = await ticketRepository.findTicketTypes();
  const ticketTypeWithHotel = ticketTypes.filter(type => type.includesHotel);

  if (!ticket) {
    throw notFoundError();
  } else if(ticket.status!=="PAID" || ticket.ticketTypeId !== ticketTypeWithHotel[0].id) {
    throw notFoundError();
  }

  const hotels = await hotelRepository.findAllHotelsInfo();

  return hotels;
}

async function getRoomByHotelId(userId: number, hotelId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw noContentError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  const ticketTypes = await ticketRepository.findTicketTypes();
  const ticketTypeWithHotel = ticketTypes.filter(type => type.includesHotel);

  if (!ticket) {
    throw notFoundError();
  } else if(ticket.status!=="PAID" || ticket.ticketTypeId !== ticketTypeWithHotel[0].id) {
    throw notFoundError();
  }

  const hotels = await hotelRepository.findAllHotelsInfo();
  if (hotels.length===0) {
    return hotels;
  }

  const hotel = hotels.filter(hotel => hotel.id===hotelId);
  if (hotel.length===0) {
    throw badRequestError();
  }

  const hotelInfo = hotel[0];

  const hotelRooms = await hotelRepository.findRoomByHotelId(hotelId);
  if (hotelRooms.length===0) {
    return hotelRooms;
  }

  return {
    id: hotelInfo.id,
    name: hotelInfo.name,
    image: hotelInfo.image,
    createdAt: hotelInfo.createdAt,
    updatedAt: hotelInfo.updatedAt,
    Rooms: hotelRooms
  };
}

const hotelService = {
  getHotels,
  getRoomByHotelId
};

export default hotelService; 
