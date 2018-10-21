//====================================================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under multiple licenses
//  (See "LICENSE" file attached in the main repository directory for license details)
//====================================================================================

package com.ambistudio.storage;

import java.util.Properties;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.EnumSet;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.StandardOpenOption;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.nio.charset.Charset;


import java.io.IOException;
import java.io.FileNotFoundException;
import java.io.RandomAccessFile;
import java.io.File;

import com.storage.Config;

public class Storage {

    public HashMap<String, List<String>> store;
    
    String rootPath;
    String docPath;
    String metaPath;
    boolean ready;
    List<String> docs;

    Properties props;

    public Storage(String roothPath) {

        this.rootPath = roothPath;
        this.ready = false;

        this.CreateDir();
        this.Init();
    }

    public boolean CreateDir() {

        String tempPath = this.rootPath + Config.DOC_DIR;
        File file = new File(tempPath);

        if (!file.exists()) {

            // Create data directory if not exists
            file.mkdir();
        }
        
        this.docPath = tempPath;
        return true;
    }

    public void Init() {

        this.metaPath = this.rootPath + Config.DOC_META_PATH;
        this.docs = this.loadContents(Paths.get(this.metaPath));

        System.out.printf("=== Docs: %d \n", docs.size());

        this.store = new HashMap<String,List<String>>();

        for (String docName: this.docs) {
            this.store.put(docName, this.loadContents(
                    this.getDocPath(docName)
            ));
        }
        
        this.ready = true;
    }

    public boolean Insert(String docName, List<String> contents) {

        if (docName.length() > 0 && contents.size() > 0) {
            Path filePath = this.getDocPath(docName);

            if (this.writeContents(filePath, contents)) {
                List<String> itemsList = this.store.get(docName);

                // if list does not exist create it
                if(itemsList == null) {
                    this.store.put(docName, contents);
                } else {
                    // add if item is not already in list
                    itemsList.addAll(contents);
                    //if(!itemsList.contains(myItem)) itemsList.add(myItem);
                }

                return true;
            }
        }

        return false;
    }

    public List<String> Load(String docName) {
        return this.loadContents(Paths.get(this.docPath + "/" + docName + Config.DOC_EXT ));
    }


    // Primate
    private Path getDocPath(String docName)  {
        
        File tempFile = new File(this.docPath + "/" + docName + Config.DOC_EXT);

        if (!tempFile.exists()) {
            try {
                tempFile.createNewFile();

                // Check for meta file exists
                if (this.docs.size() == 0) {
                    File metaFile = new File(this.metaPath);
                    if (!metaFile.exists()) {
                        metaFile.createNewFile();
                    }
                }

                // Check if doc exists in metafile
                if (this.docs.indexOf(docName) == -1) {
                    this.writeContents(
                        Paths.get(this.metaPath),
                        new ArrayList<String>(Arrays.asList(docName))
                    );
                }

            }  catch (IOException e){

                // TODO: handle file failed to create
            }
        }
        
        return Paths.get(tempFile.getPath());
    }

    private List<String> loadContents(Path filePath) {

        try {
            return Files.readAllLines(filePath);

        } catch (FileNotFoundException e) {
            // File not existed yet, or document is empty
        } catch (IOException e) {

        }
        return new ArrayList<String>();
    }

    private boolean writeContents(Path filePath, List<String> contents) {
        // byte[] charBuffer = aStringToABytes(contents);
        
        try {
            Files.write(filePath, contents, Charset.defaultCharset(), StandardOpenOption.APPEND);
        } catch (IOException  e) {

            // TODO: Handle write failure
            // Disk fail, disk full, ...
        }
 
        return true;
    }
}