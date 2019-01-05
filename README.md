This is a desktop application to get information about apartments from apartments.com. 
It uses 
<a href="https://github.com/GoogleChromeLabs/carlo" target="blank">Carlo</a>, 
<a href="https://github.com/facebook/react">React</a>,
and
<a href="https://github.com/Microsoft/TypeScript">TypeScript</a>.

# Installation

## Requirements

* <a href="https://nodejs.org/en/">Node.js</a>

* A Bing Maps API key. You can follow 
<a href="https://docs.microsoft.com/en-us/bingmaps/rest-services/getting-started-with-the-bing-maps-rest-services">this guide</a>
to obtain a key. Make sure to have the key for the installation section.

## Installation

* In a terminal, navigate to a folder where you'd like the code to be downloaded. Run
```
git clone <GITHUB_CLONE_URL>
```

* Run
```
cd <RESULTING_DIRECTORY_NAME>
```

* Run the below command. This will install the application's dependencies. It might take a little while.
```
npm install
```

* Edit the example.config.json file in the src directory. Inside the quotes on the right side of "bingmapsapikey": paste your Bing Maps API key. Save the file.
Rename it to config.json (remove the "example." prefix).

* Run
```
npm start
```
to start the application.

# Usage

## Starting Screen

If everything was successfully installed,
```
npm start
```
should launch the application and you should see a form asking for work address information.

This address is used to search apartments.com, and to calculate distance/commute times (hence needing a Bing Maps API key).

You could supply any address, it doesn't
necessarily need to be a work address.

For example, one could enter the address of the Empire State Building in the form:

* <b>Address</b>: 20 W 34th St

* <b>City</b>: New York

* <b>State</b>: NY

* <b>Postal Code</b>: 10001

Once you've entered an address to calculate distance from, click the Submit button.

## Results

You should see a table with a row for each apartment complex. These will list fields with
a link to the apartments.com listing, the apartment complex's location, its name, the drive
duration (in minutes), and its drive distance (in miles). 

There will also be an <b>Items</b> button, which will take you to a page with the apartment
complex's listings in a table. Once you're on an apartment complex's page, you can click
the back button to go back to the table of apartment complexes.