interface FileStore {
  upload: (filePath: string, fileData: Buffer) => Promise<string> // Returns file URL/path
  get: (filePath: string) => Promise<Buffer | null> // Returns file data
  delete: (filePath: string) => Promise<boolean> // Returns success status
}

export type { FileStore }
