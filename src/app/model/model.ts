export interface PageArticles {
  content?:          Articles[];
  pageable?:         Pageable;
  totalPages?:       number;
  totalElements?:    number;
  last?:             boolean;
  size?:             number;
  number?:           number;
  sort?:             Sort;
  numberOfElements?: number;
  first?:            boolean;
  empty?:            boolean;
}

export interface Articles {
  id?:              number;
  title?:           string;
  shortDescription?:string;
  description?:     string;
  publicationDate?: Date;
  categoryList?:    Category[];
  fileDataList?:    FileData[];
}

export interface Category {
  id?:          number;
  name?:        string;
  description?: string;
  checked?:     boolean;
}

export interface Pageable {
  sort?:       Sort;
  offset?:     number;
  pageNumber?: number;
  pageSize?:   number;
  paged?:      boolean;
  unpaged?:    boolean;
}

export interface Sort {
  empty?:    boolean;
  sorted?:   boolean;
  unsorted?: boolean;
}

export interface FileData {
  id?:       number;
  name?:     string;
  filePath?: string;
  type?:     string;
  description?: string;
  checked?:    boolean;
}
