import React, {useState, useEffect} from 'react';
import './App.css';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
  Paper,
  Switch,
  FormControlLabel
} from "@material-ui/core";
import { Brightness4Icon } from '@material-ui/icons/Brightness4';
import InfoBox from './InfoBox';
import Table from './Table';
import { sortData, prettyPrintStat } from './util'; 
import LineGraph from './LineGraph'
import Map from "./Map";
import "leaflet/dist/leaflet.css";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";




function App() {
const [countries, setCountries] = useState ([]);
const [country, setCountry ] = useState ("worldwide");
const [countryInfo, setCountryInfo ] = useState ({});
const [tableData, setTableData] = useState ([]);
const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
const [mapZoom, setMapZoom] = useState(2);
const [mapCountries, setMapCountries] = useState ([]);;
const [casesType, setCasesType] = useState ("cases")
// const [gestureHandling, setGestureHandling] = useState(false);
const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
  fetch('https://disease.sh/v3/covid-19/all' )
  .then((response) => response.json())
  .then(data => {
      setCountryInfo(data);
  })
}, [])



useEffect(() => {
  const getCountriesData = async () => {

    // here is the code to show the worldwide info of the cards 

        await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
        const countries = data.map((country) =>(
          {
            name: country.country, // United states, Greece
            value: country.countryInfo.iso2 // UK, USA, Greece
          }
        ));

      const sortedData =  sortData(data); 
      setTableData(sortedData);
      setMapCountries(data);
      setCountries(countries);
    })
  }

  getCountriesData(countries);
}, [])

const theme = createMuiTheme({
  palette: {
    type: darkMode ? "dark" : "light"
  },
})

const onCountryChange = async (event) => {
  const countryCode = event.target.value;
  // console.log("boooos", countryCode)
  setCountry(countryCode);

  const url = 
  countryCode === 'worldwide' 
  ? 'https://disease.sh/v3/covid-19/all' 
  : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

  await fetch(url) 
  .then ((response) => response.json())
  .then((data) => {
    setCountry(countryCode); // all the of the data from the API from country response
    setCountryInfo(data); // stores country infos into a variable 

    setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
    setMapZoom (4);

  })
}

console.log("country-info", countryInfo)

  return (
    <ThemeProvider theme={theme}>
        <Paper style={{height: "100vh"}}>
            <div className="app">
              <div className="app__left">
                <div className="app__header">
                  <h1> Covid-19 Tracker </h1>
                    <FormControl className="app__dropdown">
                    <FormControlLabel 
                    control={ <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
                    label="Dark"/>
                      <Select 
                      variant="outlined"
                      onChange={onCountryChange} 
                      value={country}>
                          <MenuItem value="worldwide">worldwide</MenuItem>
                            {countries.map(country => (
                          <MenuItem value={country.value}>{country.name}</MenuItem>
                          ))
                        }
                      </Select> 
                    </FormControl>
                </div>
                
                <div className="app__stats">
                        <InfoBox isRed active={casesType === "cases"} onClick={(e) => setCasesType('cases')} title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={countryInfo.cases} />
                        <InfoBox  active={casesType === "recovered"} onClick={(e) => setCasesType('recovered')} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={countryInfo.recovered} />
                        <InfoBox  isRed active={casesType === "deaths"}onClick={(e) => setCasesType('deaths')} title="Deaths" cases={prettyPrintStat( countryInfo.todayDeaths)} total={countryInfo.deaths} />
                </div>
                  <Map
                  center = {mapCenter}
                  zoom = {mapZoom}
                  countries ={mapCountries}
                  casesType ={casesType}
                  gestureHandling = {true}
                />
              </div>
              <Card className="app__right">
                <CardContent />
                <h3>Live Cases by Country</h3>
                <Table countries={tableData} />
                      <h3 className="app__graphTitle">Wordwide new cases {casesType}</h3>
                <LineGraph className="app__graph" casesType={casesType} />
                <CardContent />
                {/* Graph */}     
              </Card>
            </div>
        </Paper>
    </ThemeProvider>
  );
}

export default App;
