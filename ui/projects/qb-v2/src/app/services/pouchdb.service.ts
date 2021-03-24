import { isNullOrUndefined } from 'util';
import { IQuery } from './../models/query';
import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb/dist/pouchdb';

@Injectable({
  providedIn: 'root'
})
export class PouchdbService {
  db = new PouchDB('vl_query_builder');
  
  constructor() { }

  /**
   * @description This method will return the pouchdb info
   */
  getDbInfo() {
    return this.db.info();
  }

  /**
   * 
   * @param doc Query which you want to save
   * @description This method will save query into pouch db.
   * @returns - Promise<{success: boolean, msg?:string}>
   */
  saveQuery(doc: IQuery) { 
    let promise = new Promise((resolve ,reject) => {
      if(!isNullOrUndefined(doc.queryName) && !isNullOrUndefined(doc._id)) {
        this.db.put(doc);
        resolve({success: true});
      }else{
        reject({success: false, msg: 'Query Name and Id should not be null or undefined'});
      }
    })
    return promise;
  }

  /**
   * 
   * @param queryId - Query Id for which you want to get the info
   * @description - This method will fetch the query info if we provide queryId.
   * @returns - pouch db document.
   */
  getQueryInfo(queryId) {
    if(!isNullOrUndefined(queryId)) {
      return this.db.get(queryId);
    }else {
      let promise = new Promise((resolve, reject) => {
        reject({success: false, msg: 'Query id should not be null or undefined'})
      });
      return promise; 
    }
  }

  /**
   * @description - This method will fetch all documents from the pouchdb.
   */
  getAllQueries() {
    return this.db.allDocs({include_docs: true, attachments: true});
  }

  /**
   * @param queryId - Query Id of Document which you want to update.
   * @param updatedQuery - Updated Document.
   * @description - This method will update a particular document in pouchdb.
   */
  updateQuery(queryId, updatedQuery) {
    if(isNullOrUndefined(queryId) && !isNullOrUndefined(this.updateQuery)) {
      return {};
    }else {
      return {};
    }
  }

  /**
   * 
   * @param query - Query document which you want to delete.
   * @description - This method will remove document from pouchdb. If it is not null or undefined.
   */
  deleteQuery(query) {
    let promise = new Promise((resolve ,reject) => {
      if(!isNullOrUndefined(query)) {
        this.db.remove(query).then((res) => {
          resolve({success: true, msg: 'Deleted Query Successfully!'});
        }, (err) => {
          reject({success: false, msg: "Something went wrong"});
        });       
      }else {
        reject({success: false, msg: 'Query Id Should not be null or undefined'});
      }
    })
    return promise;
  }
}
