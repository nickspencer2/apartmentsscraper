import rp from "request-promise";
import * as cheerio from "cheerio";
import { LocationByAddressResponse, BingMapsClient } from "./BingMapsClient";

export type ApartmentInfo = {
    beds: string,
    baths: string,
    rent: string,
    deposit: string,
    sqft: string,
    name: string,
    available: string,
    new: string,
    [key: string]: any
}

export type ApartmentComplexInfo = {
    link: string,
    location: string,
    propertyName: string,
    driveDuration?: number,
    driveDistance?: number,
    items: ApartmentInfo[],
    [key: string]: any,
    [key: number]: any
};

export class ApartmentsScraper {

    bingMapsClient: BingMapsClient;

    constructor(bingMapsClient: BingMapsClient) {
        this.bingMapsClient = bingMapsClient;
    }

    async getApartmentComplexes (city: string, state: string, workLocation: LocationByAddressResponse): Promise<(ApartmentComplexInfo | undefined)[]> {
        const apartmentComplexLinks = await this.getApartmentComplexLinks(city, state);
        const apartmentInfos = apartmentComplexLinks
            .map(async apartmentLink => await this.getApartmentComplexInfo(apartmentLink, workLocation));
        return Promise.all(apartmentInfos);
    }

    async getApartmentComplexLinks (city: string, state: string): Promise<string[]> {
        const url = `https://www.apartments.com/${city}-${state}`;
        const options = {
            uri: url,
            transform: (body: any) => cheerio.load(body)
        };
        const apartmentsCityPage: CheerioStatic = await rp(options);
        const apartmentsContainerDiv = apartmentsCityPage("main").find("#placardContainer");
        const apartmentsAnchors = apartmentsContainerDiv.find(".placardTitle");
        const apartmentsLinks: CheerioElement[] = [];
        apartmentsAnchors.each((index, anchor) => {
            apartmentsLinks.push(anchor);
        });
        return apartmentsLinks
            .map(apartmentLink => apartmentLink.attribs.href);
    }

    async getApartmentComplexInfo (link: string, workLocation: LocationByAddressResponse): Promise<ApartmentComplexInfo | undefined> {
        const options = {
            uri: link,
            transform: (body: any) => cheerio.load(body)
        };
        const apartmentPage: CheerioStatic = await rp(options);
        // Get apartment complex location
        const location = apartmentPage(".propertyAddress")
            .find("h2")
            .text()
            .split("\n")
            .map(line => line.trim())
            .join(" ")
            .trim();
        // Get apartment complex name
        const propertyName = apartmentPage("h1.propertyName")
            .text()
            .trim();
        // Get individual apartments' info
        const availabilityTableRows = apartmentPage(".mainWrapper")
            .find("table.availabilityTable")
            .first()
            .find("tr.rentalGridRow");
        const apartmentInfo: any = [];
        availabilityTableRows.each((index, row) => {
            const rowObject: any = {};
            row.children.forEach((info) => {
                if (!info.attribs) return;
                let attrib;
                if(info.attribs.class == "beds" || info.attribs.class == "baths") {
                    attrib = info.children
                        .filter((child) => child.attribs)
                        .filter((child) => child.attribs.class.indexOf("longText") >= 0)[0];
                } else {
                    attrib = info
                }
                if (!attrib.children[0]) return;
                rowObject[info.attribs.class.trim()] = attrib.children![0].data!.trim();
            });
            apartmentInfo.push(rowObject);
        });
        const result: ApartmentComplexInfo = {
            link: link,
            location: location,
            propertyName: propertyName,
            items: apartmentInfo
        };
        // Get distance to work
        const apartmentComplexLatLng = await this.bingMapsClient.apartmentComplexLatLng(result);
        if (!apartmentComplexLatLng) return undefined;
        const distanceMatrix = await this.bingMapsClient.apartmentComplexToWorkDistance(apartmentComplexLatLng, workLocation);
        result.driveDuration = distanceMatrix.resourceSets[0].resources[0].results[0].travelDuration;
        result.driveDistance = distanceMatrix.resourceSets[0].resources[0].results[0].travelDistance;
        return result;
    }
}