import { ApartmentComplexInfo } from "./ApartmentsScraper";

import * as fs from "fs";

export interface TagType{
    [name: string]: (value: string) => [string, string]
};

export class HtmlTable {

    tableHeaders: string[] = [
        "link",
        "location",
        "propertyName",
        "items",
        "driveDuration",
        "driveDistance"
    ];

    tags: TagType = {
        "link": (link: string) => {
            return [`<a href=${link}>`, `</a>`];
        }
    };

    apartmentComplexes: ApartmentComplexInfo[];

    constructor (apartmentComplexes: any[], tableHeaders?: string[], tags?: TagType) {
        this.apartmentComplexes = apartmentComplexes;
        if (tableHeaders)
            this.tableHeaders = tableHeaders;
        if (tags)
            this.tags = tags;
    }

    createRow (apartmentComplex: ApartmentComplexInfo) {
        const cells = this.tableHeaders.map((header, index) => {
            const value = apartmentComplex[header];
            const [openTag, closeTag] = this.tags[header] ? this.tags[header](value) : ["", ""];
            let repr = `${value}`;
            if (typeof value == "object") {
                const keysource = Array.isArray(value) ? value[0] : value;
                const nestedTable = new HtmlTable(value, Object.keys(keysource));
                const nestedTableName = apartmentComplex.propertyName.split(" ").join("") + "-" + header;
                nestedTable.write(`./public/${nestedTableName}.html`);
                repr = `<a href="${nestedTableName}.html">${header}</a>`;
            };
            return "<td>" + openTag + repr + closeTag + "</td>";
        }).join("\n\t\t");
        return `<tr>\n\t${cells}</tr>`;
    }

    createHeaderRow () {
        return `<tr>\n\t\t${this.tableHeaders.map(header => `<th>${header}</th>`).join("\n\t\t")}\n\t</tr>
        `
    }

    createTable () {
        return `<table>\n\t${this.createHeaderRow()}\n${this.apartmentComplexes.map(complex => this.createRow(complex)).join("\n\t")}\n</table>`;
    }

    write (fileName: string) {
        fs.writeFileSync(fileName, this.createTable());
    }
}