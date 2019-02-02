import fetch from "node-fetch";
import { ApartmentComplexInfo } from "./ApartmentsScraper";

export type LatLng = {
    latitude: number;
    longitude: number;
}

export type TravelMode = "driving" | "walking" | "transit";

export type TimeUnit = "minute" | "second";

export type DistanceMatrixResponse = {
    authenticationResultCode: string,
    brandLogoUri: string,
    copyright: string,
    resourceSets: {
        estimatedTotal: number, 
        resources: DistanceMatrixResource[]
    }[],
    statusCode: number,
    statusDescription: string,
    traceId: string
}

export type DistanceMatrixResource = {
    __type: string,
    destinations: LatLng[],
    errorMessage: string,
    origins: LatLng[],
    results: {
        destinationIndex: number,
        originIndex: number,
        totalWalkDuration: number,
        travelDistance: number,
        travelDuration: number
    }[]
}

export type LocationByAddressResponse = {
    authenticationResultCode: string,
    brandLogoUri: string,
    copyright: string,
    resourceSets: {
        estimatedTotal: number,
        resources: LocationByAddressResource[]
    }[],
    statusCode: number,
    statusDescription: string,
    traceId: string
}

export type LocationByAddressResource = {
    __type: string,
    bbox: number[],
    name: string,
    point: {
        type: "Point",
        coordinates: [number, number]
    },
    address: {
        addressLine: string,
        adminDistrict: string,
        countryRegion: string,
        formattedAddress: string,
        locality: string,
        postalCode: string
    },
    confidence: string,
    entityType: string,
    geocodePoints: {
        type: "Point",
        coordinates: [number, number],
        calculationMethod: string,
        usageTypes: string[]
    }[],
    matchCodes: string[]
}

export class BingMapsClient {

    static now = new Date().getTime();

    bingMapsApiKey: string;

    constructor(bingMapsApiKey: string) {
        this.bingMapsApiKey = bingMapsApiKey;
    }

    latLngUrlString(locations: LatLng[]) {
        return locations.map((latLng) => `${latLng.latitude},${latLng.longitude}`).join(";");
    }

    async getDistanceMatrix(origins: LatLng[], destinations: LatLng[], travelMode: TravelMode, startTime?: string, timeUnit?: TimeUnit): Promise<DistanceMatrixResponse> {
        const originsString = this.latLngUrlString(origins);
        const destinationsString = this.latLngUrlString(destinations);
        const url = `https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?`
            + `origins=${originsString}`
            + `&destinations=${destinationsString}`
            + `&travelMode=${travelMode}`
            + `${startTime ? `&startTime=${startTime}` : ""}`
            + `${timeUnit ? `&timeUnit=${timeUnit}` : ""}`
            + `&key=${this.bingMapsApiKey}`;
        try {
            const result = await fetch(url);
            const resultJson = await result.json();
            if (resultJson.statusCode != 200) {
                throw new Error("Distance Matrix fetch error: \n" + JSON.stringify(resultJson, null, 4));
            }
            return resultJson as DistanceMatrixResponse;
        } catch (err) {
            throw err;
        }
    }

    async apartmentComplexToWorkDistance(apartmentComplex: LocationByAddressResponse, work: LocationByAddressResponse, startTime?: string, timeUnit?: TimeUnit) {
        return this.getDistanceMatrix(
            [{
                latitude: apartmentComplex.resourceSets[0].resources[0].point.coordinates[0],
                longitude: apartmentComplex.resourceSets[0].resources[0].point.coordinates[1]
            }],
            [{
                latitude: work.resourceSets[0].resources[0].point.coordinates[0],
                longitude: work.resourceSets[0].resources[0].point.coordinates[1]
            }],
            "driving",
            startTime,
            timeUnit
        );
    }

    async getLatLng(address: string, city: string, state: string, postalCode: string) {
        const url = `http://dev.virtualearth.net/REST/v1/Locations/US/`
            + `${state}`
            + `/${postalCode}`
            + `/${city}`
            + `/${address}`
            + `?`
            + `&key=${this.bingMapsApiKey}`;

        try {
            const response = await fetch(url);
            const responseJson = await response.json();
            if (responseJson.statusCode != 200) {
                throw new Error("Location by Address fetch error: \n" + JSON.stringify(responseJson, null, 4));
            } 
            return responseJson as LocationByAddressResponse;
        } catch (err) {
            throw err;
        }
    }

    async apartmentComplexLatLng(apartmentComplex: ApartmentComplexInfo | {location: string}): Promise<LocationByAddressResponse | undefined> {
        const locationString = apartmentComplex.location;
        const locationSplit = locationString.split(",");
        try {
            return this.getLatLng(
                locationSplit[0],
                locationSplit[1],
                locationSplit[2].split(" ")[0],
                locationSplit[2].split(" ")[1]
            );
        } catch (error) {
            console.error(`Error getting latLng: ${error}`);
            console.log(`locationString: ${locationString}`);
        }
    }
}