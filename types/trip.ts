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

export type CreateTripForm = {
    name: string
    resume: string
}

export type CreateTripData = {
    name: string
    startDate: string
    endDate: string | null
    userId: string
    resume: string
    currentTrip: boolean
}