package com.ambistudio.vasern;

import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;

import java.util.List;

class VasernUtils {

    public static WritableArray listToWriableArray(List<String> inputs) {

        WritableArray data = Arguments.createArray(); 
    
        if (inputs != null) {
    
          for (String line: inputs) {
            data.pushString(line);
          }
        }
    
        return data;
      }
}