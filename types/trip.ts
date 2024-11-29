import { Picture } from "./picture"

export type Trip = {
    id: string
    name: string
    startDate: string
    endDate: string
    userId: string
    resume: string
    pictures: Picture[]
    currentTrip: boolean
}

export type TripFirestore = {
    id: string
    data: Trip
}

export type AllTrips = {
    id: string
    data: Trip[]
}

export type CreateTripForm = {
    name: string
    resume: string
    startDate: string
}

export type CreateTripData = {
    name: string
    startDate: string
    userId: string
    resume: string
    currentTrip: boolean
}

export type TripDTO = {
    name: string
    startDate: string
    endDate: string
    pictures: Picture[]
}