"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Home() {
  const [files, setFiles] = useState<string[]>([]);
  const [newFile, setNewFile] = useState<string>("");

  const handlFileSumit = async (e: any) => {
    e.preventDefault();
    console.log(newFile);

    const updatedFiles = [...files, newFile];

    setFiles(updatedFiles);

    return;
  };

  const handleSearch = async (e: any) => {
    e.preventDefault();
  };
  return (
    <div className="container flex justify-around">
      <div className="workspace">
        <div className="workspace-form">
          <h1 className="text-2xl font-semibold text-gray-900">Upload file</h1>
          <p className="mt-1 text-sm/6 text-gray-600">
            This is where you upload your file
          </p>
          <form
            className="grid w-full  items-center gap-1.5 mt-5"
            onSubmit={handlFileSumit}
          >
            <Label htmlFor="picture">Chose any file</Label>
            <Input
              id="file"
              type="file"
              className="mt-2"
              onChange={(e) => {
                const file = e.target?.files?.[0];

                if (file) {
                  setNewFile(file.name);
                }
              }}
              required
            />
            <Button type="submit" className="mt-4 cursor-pointer">
              Submit
            </Button>
          </form>
        </div>

        <div className="file-storage mt-15 space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            File Storage
          </h1>
          {files.map((file, index) => (
            <div
              key={index}
              className="border rounded-sm flex items-center justify-between"
            >
              <p className="p-4 ">{file}</p>
              <Button className="rounded-sm mr-2">View</Button>
            </div>
          ))}
        </div>
      </div>
      <div className="search">
        <h1 className="text-2xl font-semibold text-gray-900">Search</h1>
        <form className="mt-5 gap-2 grid" onSubmit={handleSearch}>
          <Label htmlFor="picture">Search for information</Label>
          <Input type="text" className="w-60" placeholder="Search" />
          <Button type="submit" className="mt-4 cursor-pointer">
            Search
          </Button>
        </form>
      </div>
    </div>
  );
}
