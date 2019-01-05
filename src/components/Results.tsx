import * as React from "react";
import { ApartmentComplexInfo } from "../scraper/ApartmentsScraper";
import { Result } from "./Result";
import { Apartments } from "./Apartments";

export interface Props {
    results: ApartmentComplexInfo[]
}

export interface State {
    showItems: boolean,
    showItemIndex: number
}

export class Results extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showItems: false,
            showItemIndex: -1
        };
    }

    showItems = (index: number) => {
        this.setState({
            showItems: true,
            showItemIndex: index
        });
    }

    onBackClick = () => {
        this.setState({
            showItems: false,
            showItemIndex: -1
        });
    }

    render() {
        return (
            this.state.showItems ?
                <Apartments apartmentInfos={this.props.results[this.state.showItemIndex].items} onBackClick={this.onBackClick} />
                :
                <table>
                    <thead>
                        <tr>
                            {Object.keys(this.props.results[0]).map(key =>
                                <th key={key}>{key}</th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {this.props.results.map(result => <Result key={result.propertyName} result={result} showItems={this.showItems}/>)}
                    </tbody>
                </table>
        );
    }
}