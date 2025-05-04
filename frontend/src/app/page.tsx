"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { headers } from "next/headers";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<any>(null);
  const [query, setQuery] = useState<string>("");
  const [content, setContent] = useState<string[]>([]);

  const handlFileSumit = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();

    if (!file) {
      console.error("No file selected");
      return;
    }

    try {
      const formData = new FormData();
      console.log(file);
      formData.append("file", file, file.name);
      const response = await axios.post(
        "http://localhost:8000/documents",
        formData
      );

      const result = await response.data;
      console.log(result);

      console.log();
      return response;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  const handleSearch = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    console.log(query);
    try {
      const response = await fetch("http://localhost:8000/search", {
        method: "POST",
        body: JSON.stringify({ query }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log(result);
    } catch (err) {
      console.log(err);
      return err;
    }
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) setFile(file);
              }}
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
          {/* {files.map((file, index) => (
            <div
              key={index}
              className="border rounded-sm flex items-center justify-between"
            >
              <p className="p-4 ">{file}</p>
              <Button className="rounded-sm mr-2">View</Button>
            </div>
          ))} */}
        </div>
      </div>
      <div className="content flex justify-around">
        <div className="search">
          <h1 className="text-2xl font-semibold text-gray-900">Search</h1>
          <form
            className="mt-5 gap-2 grid"
            onSubmit={handleSearch}
            onChange={(e: React.ChangeEvent<any>) => setQuery(e.target.value)}
          >
            <Label htmlFor="picture">Search for information</Label>
            <Input type="text" className="w-60" placeholder="Search" />
            <Button type="submit" className="mt-4 cursor-pointer">
              Search
            </Button>
          </form>

          <div className="mt-15">
            <h1 className="text-2xl font-semibold text-gray-900">Content</h1>
            {}
            
          </div>
        </div>
      </div>
    </div>
  );
}
