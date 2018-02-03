import React, { Component } from 'react';
import './App.css';

import SearchQuery from './components/SearchQueryComponent'
import ColorCounts from './components/CarColorComponent'
import StatePlates from './components/StatePlatesComponent'
import AgencyCounts from './components/AgencyCountsComponent'
import TicketCounts from './components/TicketCountsComponent'
import AvgFinePerDayofWeek from './components/AvgFinePerDayofWeekComponent'

class App extends Component {
  handleQueryParameterSelection (params) {
    this.setState({d:params})
  }
  render() {
    const searchParams = (this.state == null) ? null : this.state.d
    return (
      <div>
        <nav className="nav-wrapper">
          <div className="brand-logo center">TICKETS EXPLORER</div>
        </nav>
        <br/>
        <br/>
        <div className="container">
          <div className="row">
            <div className="col s4">
              <SearchQuery onQueryParametersSelected={(params) => this.handleQueryParameterSelection(params)}/>
            </div>
            <div className="col s8">
              <h1 className="App-title"></h1>
              <p>This page allows you to view statistics on vehicular tickets issued in Los Angeles county from January 1, 2016 to June 30, 2017. The data come from <a href="https://data.lacity.org" target="_blank">Los Angeles Open Data</a>. The original data set can be found <a href="https://data.lacity.org/A-Well-Run-City/Parking-Citations/wjz9-h9np" target="_blank">here</a>.</p>
              <p>The original data set has been cleaned and modified.  Ticket entries missing key data like date  issued and fine amount were deleted.  Other important ticket elements considered were ticket number and time issued. Date and time formats were standardized. Similar color cars were grouped together into buckets.  All data set modifications were performed with Pandas.</p>
              <p>The statistics compiled here are descriptive. You will find ordered counts of color, automobile maker., issuing agency, state or province of ticketed plate, etc. </p>
              <p>Perform queries on the dataset by selecting any of the available options.</p>
              <ul>
                <li><b>Start Date:</b> The earliest date to consider</li>
                <li><b>End Date:</b> The latest date to consider</li>
                <li><b>Minimum fine amount:</b> The smallest fine amount to consider</li>
                <li><b>Maximum fine amount:</b> The largest fine amount to consider</li>
                <li><b>Color:</b> Limit search to the color of the automobile</li>
                <li><b>Make:</b> Limit the search to a specific car manufacturer</li>
                <li><b>Agency:</b> Limit your search to tickets issued by agency</li>
              </ul>
              <br/>
              <TicketCounts params={searchParams} />
              <AvgFinePerDayofWeek params={searchParams} />
              <StatePlates params={searchParams} />
              <ColorCounts params={searchParams} />
              <AgencyCounts params={searchParams} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;