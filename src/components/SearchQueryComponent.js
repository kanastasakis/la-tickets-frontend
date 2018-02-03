import React, { Component } from 'react';

class SearchQuery extends Component {
    fine_max = null

    updateSearchParameters() {
        let params = { }
        this.getChosenParams(params, 'color')
        this.getChosenParams(params, 'agency')
        this.getChosenParams(params, 'state')
        this.getChosenParams(params, 'make')
        this.getChosenParams(params, 'desc')
        this.getChosenParams(params, 'fine_max')
        this.getChosenParams(params, 'fine_min')
        this.getChosenParams(params, 'start_date')
        this.getChosenParams(params, 'end_date')

        if(this.props.onQueryParametersSelected){
            this.props.onQueryParametersSelected(params)
        }
    }

    getChosenParams(params, ref_key) {
        var refValue = this.refs[ref_key].value
        if(refValue !== null && refValue !== '-' && refValue !== '') {
            params[ref_key] = refValue
        }
    }

    clearSearchParameters() {
        this.refs.color.value = "-"
        this.refs.agency.value = "-"
        this.refs.state.value = "-"
        this.refs.make.value = ""
        this.refs.desc.value = ""
        this.refs.fine_max.value = ""
        this.refs.fine_min.value = ""
        this.refs.start_date.value = ""
        this.refs.end_date.value = ""
    }

    render() {
        // Colors ==============
        let clrVals = [ {  value: "WT", color:"White" },{  value: "TN", color:"Tan" },{  value: "BG", color:"Beige" },{  value: "PK", color:"Pink" },{  value: "BL", color:"Blue" },{  value: "BN", color:"Brown" },{  value: "GY", color:"Grey" },{  value: "BK", color:"Black" },{  value: "RD", color:"Red" },{  value: "SI", color:"Silver" },{  value: "GD", color:"Gold" },{  value: "MR", color:"Maroon" },{  value: "GN", color:"Green" },{  value: "OT", color:"Other" },{  value: "OR", color:"Orange" },{  value: "YL", color:"Yellow" }]
        clrVals.sort(function (a, b) {
            let clra = a.color.toUpperCase()
            let clrb = b.color.toUpperCase()
            if(clra < clrb) return -1
            if(clra > clrb) return 1
            return 0
        })
        clrVals.unshift({  value: "-", color:"Select color" })
        let clrOptions = clrVals.map(function (d) {
            return <option value={d.value} >{d.color}</option>
        })

        // Location ==============
        let stateVals = [{value:"WA", state:"Washington"},{value:"WI", state:"Wisconsin"},{value:"WV", state:"West Virginia"},{value:"FL", state:"Florida"},{value:"WY", state:"Wyoming"},{value:"NH", state:"New Hampshire"},{value:"NJ", state:"New Jersey"},{value:"NM", state:"New Mexico"},{value:"NC", state:"North Carolina"},{value:"ND", state:"North Dakota"},{value:"NE", state:"Nebraska"},{value:"NY", state:"New York"},{value:"RI", state:"Rhode Island"},{value:"NV", state:"Nevada"},{value:"GU", state:"Guam"},{value:"CO", state:"Colorado"},{value:"CN", state:"Canada"},{value:"CA", state:"California"},{value:"XX", state:"Unknown"},{value:"GA",state:"Georgia"},{value:"CT", state:"Connecticut"},{value:"OK", state:"Oklahoma"},{value:"OH", state:"Ohio"},{value:"KS", state:"Kansas"},{value:"SC", state:"South Carolina"},{value:"KY", state:"Kentucky"},{value:"OR", state:"Oregon"},{value:"SD", state:"South Dakota"},{value:"DE", state:"Delaware"},{value:"DC", state:"WashingtonDC"},{value:"HI", state:"Hawaii"},{value:"PR", state:"Puerto Rico"},{value:"TX", state:"Texas"},{value:"LA", state:"Louisiana"},{value:"TN", state:"Tennessee"},{value:"PA", state:"Pennsylvania"},{value:"VA", state:"Virginia"},{value:"VI", state:"Virgin Islands"},{value:"AK", state:"Alaska"},{value:"AL", state:"Alabama"},{value:"AR", state:"Arkansas"},{value:"VT", state:"Vermont"},{value:"IL", state:"Illinois"},{value:"IN", state:"Indiana"},{value:"IA", state:"Iowa"},{value:"AZ",state:"Arizona"},{value:"ID", state:"Idaho"},{value:"ME", state:"Maine"},{value:"MD", state:"Maryland"},{value:"MA", state:"Massachusetts"},{value:"UT", state:"Utah"},{value:"MO", state:"Missouri"},{value:"MN", state:"Minnesota"},{value:"MI", state:"Michigan"},{value:"MT", state:"Montana"},{value:"MS", state:"Mississippi"},{value:"MX", state:"Mexico"}]
        stateVals.sort(function (a, b) {
            let sta = a.state.toUpperCase()
            let stb = b.state.toUpperCase()
            if(sta < stb) return -1
            if(sta > stb) return 1
            return 0
        })
        stateVals.unshift({ value: "-", state:"Select location" })
        let stateOptions = stateVals.map(function (d) {
            return <option value={d.value} >{d.state}</option>
        })

        // Agency ==============
        let agencyVals = [{value:"-", agency:"Select issuing agency"},{value:"60", agency:"DOT - RESIDENTIAL TASK FORCE"},{value:"61", agency:"CORT METRO"},{value:"62", agency:"CORT VALLEY"},{value:"63", agency:"EMERGENCY DETAIL"},{value:"64", agency:"SPECIAL ENFORCEMEN-DOT HOLLYWOOD"},{value:"65", agency:"SPECIAL ENFORCEMENT-DOT SOUTHERN"},{value:"66", agency:"SPECIAL ENFORCEMENT-DOT CENTRAL"},{value:"90", agency:"AIRPORT CURRENT"},{value:"20", agency:"CALIFORNIA HIGHWAY PATROL"},{value:"21", agency:"CALIFORNIA STATE POLICE"},{value:"22", agency:"CA PARKS & REC"},{value:"2", agency:"LAX CURRENT"},{value:"4", agency:"HOLLYWOOD"},{value:"6", agency:"CENTRAL"},{value:"8", agency:"AIRPORT BACK"},{value:"96", agency:"RANGERS"},{value:"91", agency:"AIRPORT BACKLOG"},{value:"59", agency:"DOT-DISABLED PLACARD TASK FORCE"},{value:"93", agency:"PARKS AND REC"},{value:"92", agency:"HARBOR"},{value:"95", agency:"HOUSING AUTHORITY"},{value:"94", agency:"FIRE DEPARTMENT"},{value:"97", agency:"HOUSING DEPARTMENT"},{value:"14", agency:"MARSHALLS OFFICE"},{value:"11", agency:"VN AIRPORT"},{value:"10", agency:"LAPD BACKLOG"},{value:"12", agency:"PARK RANGERS"},{value:"15", agency:"PUBLIC UTILITIES"},{value:"58", agency:"SPECIAL EVENTS"},{value:"17", agency:"LASD - CITY ENFORCEMENT"},{value:"16", agency:"ANIMAL REGULATION DEPARTMENT"},{value:"55", agency:"DOT - SOUTHERN"},{value:"54", agency:"DOT - HOLLYWOOD"},{value:"57", agency:"HABITUAL VIOLATORS"},{value:"56", agency:"DOT - CENTRAL"},{value:"51", agency:"DOT - WESTERN"},{value:"50", agency:"DOT - HARBOR"},{value:"53", agency:"DOT - VALLEY"},{value:"52", agency:"DOT - WILSHIRE"},{value:"18", agency:"CONVENTION CENTER"},{value:"88", agency:"LAPD CURRENT"},{value:"89", agency:"LAPD BACKLOG"},{value:"82", agency:"DOT - VALLEY"},{value:"83", agency:"DOT - HOLLYWOOD"},{value:"80", agency:"DOT - WESTERN"},{value:"81", agency:"DOT - WILSHIRE"},{value:"86", agency:"HABITUAL VIOLS"},{value:"87", agency:"SPECIAL EVENTS"},{value:"84", agency:"DOT - SOUTHERN"},{value:"85", agency:"DOT - CENTRAL"},{value:"44", agency:"LIBRARY - SECURITY FORCE"},{value:"40", agency:"BUILDING AND SAFETY"},{value:"41", agency:"STREET USE INSPECTORS"},{value:"1", agency:"WESTERN"},{value:"3", agency:"VALLEY"},{value:"5", agency:"SOUTHERN"},{value:"7", agency:"HPV"},{value:"9", agency:"BANDIT CAB TASK FORCE"},{value:"75", agency:"US FEDERAL PROTECTIVE SERV"},{value:"72", agency:"VALLEY ABATEMENT"},{value:"71", agency:"METRO ABATEMENT"},{value:"35", agency:"AMTRAK POLICE DEPT"},{value:"34", agency:"GENERAL SERVICES DEPARTMENT"},]
        agencyVals.sort(function (a, b) {
            let aga = a.agency.toUpperCase()
            let agb = b.agency.toUpperCase()
            if(aga < agb) return -1
            if(aga > agb) return 1
            return 0
        })
        agencyVals.unshift({ value: "-", agency:"Select location" })
        let agencyOptions = agencyVals.map(function (d) {
            return <option value={d.value} >{d.agency}</option>
        })
        return (
        <div>
            <div>
                <label>Minimum Fine Amount</label> <br/>
                <input className="validate" ref="fine_min" type="number" min='0' max='1000' placeholder="0" name="fine_lower"/>
            </div>
            <div>
                <label>Maximum Fine Amount</label> <br/>
                <input className="validate" ref="fine_max" type="number" min='0' max='1000' placeholder="1000" name="fine_upper"/>
            </div>
            <div>
                <label>Start Date</label> <br/>
                <input className="validate" ref="start_date" type="date" name="start_date" min="2014-12-31" max="2016-12-31"/>
            </div>        
            <div>
                <label>End Date</label> 
                <input className="validate" ref="end_date" type="date" name="end_date" min="2014-12-31" max="2016-12-31"/>
            </div>
            <div>
                <label>Ticket Description</label>
                <input ref="desc" type="text" name="description" maxLength="50" placeholder="Green stripe"/>
            </div>
            <div>
                <label>Vehicle Manufacturer</label>
                <input ref="make" type="text" name="make" maxLength="10" placeholder="Subaru"/>
            </div>
            <div>
                <label>Vehicle Color</label> 
                <select ref="color" className="browser-default" defaultValue="-">
                    {clrOptions}
                </select>
            </div>
            <br/>
            <div>
                <label>State or Province on Plate</label>
                <select ref="state" className="browser-default" defaultValue="-">
                    {stateOptions}
                </select>
            </div>
            <br/>
            <div>
                <label>Issuing Agency</label>
                <select ref="agency" className="browser-default" defaultValue="-">
                    {agencyOptions}
                </select>
            </div>
            <br/>
            <button className="btn" style={{width: '100%'}} onClick={event => this.clearSearchParameters()}>CLEAR</button>
            <br/>
            <br/>
            
            <button className="btn" style={{width: '100%'}} onClick={event => this.updateSearchParameters()}>SEARCH</button>
        </div>
        );
    }
}

export default SearchQuery