# Griddyna-App

This app has for main goal to create a mapping between equipments of a network, and their dynamic model representation.
This mapping is a tool to quickly create data sets for the dynamic simulations of electric networks.

The main result of the app is, for now, a script that can be used to generate the .dyd file that can be fed to the
simulators. It can also manage, for a given network, to create the .par file that can instantiate the model using data
specific (or not) to the network.

Finally, the app gives a preview of how different equipments of the network will be modeled using the selected mapping.

## Front-End Architecture

The code is sorted into three main parts:

### 1) Components

They are what the user **sees**, their sole function is to display the data to the user and present how to modify it.

**There is no data processing logic in the components**, only display logic is present.

This project use [atomic-design](https://bradfrost.com/blog/post/atomic-web-design/) to sort components and avoid
writing several times the same function/display.

a) "Atoms" are meant to be the smallest generic components(e.g. Buttons), and are meant to be reused.

b) "Molecules" are slightly bigger components that still aims to be generic, but have a more complex function to fill.
They are usually groups of atoms.

_The distinction between Atoms and Molecules is difficult and no two project will have the same distinction, but both
types have the same goal: provide generic reusable components._

c) "Organisms" are groups of molecules and/or other organisms. This is where the work-specific display is, they are a
complex, distinct section of the interface. For instance a complete form for the user to fill using the project data.

d) "Templates" goal is to organize the different organisms on the display to form the pages. They are the layout of the
application.

### 2) Containers

Containers are the links between the presentational components and the data. There is usually one container for each
work-specific concern, they can be nested to enhance readability.

They subscribe to the data store relevant to their specific concern and instantiate the functions that modify the data
store. They then instantiate the presentational components with ready-to-display data and functions to call.

There is usually no or little display associated with a Container

_This is not where the data is processed in this project, the containers call specific selectors to receive only the
data relevant to them, **containers role is only to prepare side effects and link the Model with the View**._

### 3) Data Store

This is where **all** front-end data is stored, fetched and processed. All interactions with the data happens in this
section.

This project use [`redux-toolkit`](https://redux-toolkit.js.org/) (RTK) to manage data and how data is processed is
heavily influenced by its concepts.

First, the data store is organised into _slices_ that are (conceptually and often literally) related to back-end
services. Each slice contains the data relevant to one particular function of the application.

Each slice possesses the following:

#### a) Data state

This is the single source of truth of your applications, from where all the data needed by the function are accessed and
derived. **No data is redundant, there is no derived value here.**

#### b) Selectors

Selectors are the functions called by the Containers to retrieve the data needed by the presentational components, all
derived data should be obtained from a selector.

A selector has for argument the state of the slice. It is possible to add other arguments to selector by using
`React.useMemo` and `RTK.createSelector` to customise the fetched data. `RTK.createSelector can also be used to combine
reducers to create a more complex one.

_There is no inherent reason to not have Selectors fetching data from separate slices, however, in most cases, it is
unnecessary if the slices are well conceived._

#### c) Reducers

Reducers are the functions to edit the state data. **This is the only way for the front-end to edit it.**

They are functions taking the state and an action from a Container as arguments to modify the state.

#### d) ExtraReducers

ExtraReducers are also reducers, but they are related to asynchronous functions. They are the way for the front-end to
interact with the server.

In the slice are defined functions created by `RTK.createAsyncThunk` that make REST calls (using `fetch`). The state can
then be changed according to the result (or the error) received by the server. These functions are called by the
containers.

## Typescript config

Files tsconfig.json and src/react-app-env.d.ts both results from create-react-app typescript template (version 5).
Some property values have been changed to meet the project needs (ex: target, baseUrl,...).

#### License Headers and dependencies checking

To check dependencies license compatibility with this project one locally, please run the following command :

```
npm run licenses-check
```

Notes :
* Check [license-checker-config.json](license-checker-config.json) for license white list and exclusion.
If you need to update this list, please inform organization's owners.
* Excluded dependencies :
    * esprima@1.2.2 : old version of a dependency which doesn't have a recognized license identifier on https://spdx.org/licenses/ (BSD)
    * jackspeak@2.3.6 and path-scurry@1.10.2 : dependencies to be removed once Vite migration done
