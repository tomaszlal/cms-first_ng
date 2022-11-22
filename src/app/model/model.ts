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
  description?:     string;
  publicationDate?: Date;
  categoryList?:    CategoryList[];
}

export interface CategoryList {
  id?:          number;
  name?:        string;
  description?: string;
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
