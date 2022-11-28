import { AuthenticatedRequest } from "@/middlewares";
import hotelService from "@/services/hotel-service";
import { Response } from "express";
import httpStatus from "http-status";
 
export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try{
    const hoteis = await hotelService.getHotels(userId);
      
    if(!hoteis) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.status(httpStatus.OK).send(hoteis);
  } catch(error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getRooms(req: AuthenticatedRequest, res: Response) {
  const { hotelId } = req.params;

  try {
    const userRoom = await hotelService.getRoomByHotelId(Number(hotelId));

    return res.status(httpStatus.OK).send(userRoom);
  } catch (error) {
    if(error.name === "UnauthorizeError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    return res.sendStatus(httpStatus.NOT_FOUND);
  }
} 
