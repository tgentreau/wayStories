type Trip = {
    id: string
    name: string
    startDate: string
    endDate: string
    userId: string
    resume: string
    pictures: string[]
    currentTrip: boolean
}

type CreateTripForm = {
    name: string
    resume: string
    startDate: string
}

type CreateTripData = {
    name: string
    startDate: string
    userId: string
    resume: string
    currentTrip: boolean
}

type TripDTO = {
    name: string
    startDate: string
    endDate: string
    pictures: string[]
}