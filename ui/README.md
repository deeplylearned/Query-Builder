# Query Builder
This is a GUI to build elastic search queries.

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Dependencies](#dependencies)
* [Setup](#setup)

## General info
Query builder is used to build custom queries and download the query results in an excel file.

## Technologies
Project is created with:
- Angular 7
- PouchDb
- compodoc

## Dependencies
- Ngbootstrap: 4.2.2
- ng-select: 2.20.x
- ngx-toastr: 9.1.2
- ngx-ui-loader: 7.x.x


## Setup
To setup this project
```
$ git clone https://github.com/VassarLabsInc/Query-Builder.git
$ cd Query-Builder/ui
```
To run query builder version-1
```
Query-Builder/ui$ npm run qb:s-o
```
To run Query-Builder version-2
```
Query-Builder/ui$ npm run qb-v2:s-o
```
The app will automatically reload if you change any of the source files.

## Build

Run `npm run qb:build` to build the Query-Builder version 1. The build artifacts will be stored in the `dist/qb` directory.

Run `npm run qb-v2:build` to build the Query-Builder version 2. The build artifacts will be stored in the `dist/qb-v2` directory.

## Running unit tests

## Running end-to-end tests