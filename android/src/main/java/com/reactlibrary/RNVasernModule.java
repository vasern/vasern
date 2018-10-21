
package com.reactlibrary;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.io.Console;

import com.facebook.react.bridge.Promise;
import com.reactlibrary.storage.Storage;

public class RNVasernModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  private Storage db;

  private HashMap<String, ArrayList<String>> store;

  public RNVasernModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    this.db = new Storage(reactContext.getFilesDir().getPath());
  }

  @Override
  public String getName() {
    return "VasernManager";
  }

  /**
   * Request method return all in-memory records of a document
   * @param docName: Document name
   * @param promise: Promise object returned to JavaScript side
   */
  @ReactMethod
  public void Request(String docName, Promise pm) {
    WritableMap result = Arguments.createMap();
    result.putArray("data", VasernUtils.listToWriableArray(this.db.store.get(docName)));
    pm.resolve(result);
  }

  /**
   * Load records of the document from its data file
   * @param docName: Document name
   * @param promise: Promise object returned to JavaScript side
   */
  @ReactMethod
  public void Load(String docName, Promise promise) {

    List<String> listStrOutputs = this.db.Load(docName);
    WritableArray data = VasernUtils.listToWriableArray(listStrOutputs);
    WritableMap result = Arguments.createMap();
    result.putArray("data", data);
    promise.resolve(result);
  }

  /**
   * Write records to document's data file 
   * and merge record list with its document's in-memory records
   * @param docName: Document name
   * @param data: Array of string which are records
   * @param options: insert options, will be used for creating snapshot, encryption, etc.
   * @param promise: Promise object that will be passed to JavaScript side
   */
  @ReactMethod
  public void Insert(String docName, ReadableArray data, ReadableArray options, Promise promise) {

    ArrayList inputs = data.toArrayList();
    boolean success = this.db.Insert(docName, inputs);
    if (success) {
      WritableMap result = Arguments.createMap();
      result.putInt("status", 200);
      promise.resolve(true);
    } else {
      promise.reject("404", "Unable to write data");
    }
  }

  // private WritableArray listToWriableArray(List<String> inputs) {

  //   WritableArray data = Arguments.createArray(); 

  //   if (inputs != null) {

  //     for (String line: inputs) {
  //       data.pushString(line);
  //     }
  //   }

  //   return data;
  // }
}