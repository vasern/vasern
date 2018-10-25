//====================================================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under multiple licenses
//  (See "LICENSE" file attached in the main repository directory for license details)
//====================================================================================

package com.reactlibrary.storage;

import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;

import java.io.IOException;
import java.io.FileNotFoundException;
import java.io.RandomAccessFile;
import java.io.DataOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;

import java.nio.charset.Charset;

public class Storage {

    public HashMap<String, List<String>> store;
    
    String rootPath;
    String docPath;
    String metaPath;
    boolean ready;
    List<String> docs;

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
        this.docs = this.loadContents(this.metaPath);
        this.store = new HashMap<String,List<String>>();

        for (String docName: this.docs) {
            this.store.put(docName, loadContents(getDocPath(docName)));
        }
        
        this.ready = true;
    }

    public boolean Insert(String docName, List<String> contents) {

        if (docName.length() > 0 && contents.size() > 0) {
            String filePath = this.getDocPath(docName);

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
        return this.loadContents(this.docPath + "/" + docName + Config.DOC_EXT);
    }


    // Primate
    private String getDocPath(String docName)  {
        
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
                        this.metaPath,
                        new ArrayList<String>(Arrays.asList(docName))
                    );
                }

            }  catch (IOException e){
                // TODO: handle file failed to create
            }
        }
        return tempFile.getPath();
    }

    private List<String> loadContents(String filePath) {
        try {
            
            ArrayList<String> list = new ArrayList<String>();

            RandomAccessFile raf = new RandomAccessFile(filePath, "rw");
            raf.seek(0);
            
            String line;
            while((line = raf.readLine()) != null) {
                list.add(line.substring(2));
            }
            raf.close();
            return list;

        } catch (FileNotFoundException e) {
            // File not existed yet, or document is empty

        } catch (IOException e) {

        }

        return new ArrayList<String>();
    }

    // Convert a List<String> to byte[], used when writing records to file
    static byte[] listStringToBytes(List<String> list) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        DataOutputStream out = new DataOutputStream(baos);
        for (String line : list) {
            out.writeUTF(line);
            out.writeBytes(System.getProperty("line.separator"));
        }
        return baos.toByteArray();
    }

    private boolean writeContents(String filePath, List<String> contents) {
        
        try {
            RandomAccessFile raf = new RandomAccessFile(filePath, "rw");
            raf.seek(raf.length());
            raf.write(Storage.listStringToBytes(contents));
            raf.close();
        } catch (IOException  e) {

            // TODO: Handle write failure
            // Disk fail, disk full, ...
        }
 
        return true;
    }
}