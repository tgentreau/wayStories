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
}

type CreateTripData = {
    name: string
    startDate: string
    endDate: string | null
    userId: string
    resume: string
    currentTrip: boolean
}