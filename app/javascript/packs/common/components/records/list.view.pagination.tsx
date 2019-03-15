import * as React from 'react';
import { Pagination, PaginationProps } from 'semantic-ui-react'

export interface RecordTablePaginationProps {
  activePage: number;
  defaultActivePage?: number;
  totalPages: number;

  onPageChange: (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => void;
}

export const RecordTablePagination: React.StatelessComponent<RecordTablePaginationProps> = (props): JSX.Element => {
  return (
    <Pagination
      activePage={props.activePage}
      boundaryRange={1}
      siblingRange={1}
      defaultActivePage={props.defaultActivePage}
      totalPages={props.totalPages}
      onPageChange={props.onPageChange}
      size='mini'
      lastItem={props.activePage < props.totalPages - 3 ? undefined : null}
      nextItem={props.activePage < props.totalPages ? undefined : null}
      firstItem={props.activePage > 4 ? undefined : null}
      prevItem={props.activePage > 1 ? undefined : null}
    />
  );
};

export default RecordTablePagination;
