import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { ConfirmComponent } from "src/app/modules/shared/components/confirm/confirm.component";
import { CategoryService } from "src/app/modules/shared/services/category.service";
import { NewCategoryComponent } from "../new-category/new-category.component";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.css"],
})
export class CategoryComponent implements OnInit {
  constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }
  displayedColumns: string[] = ["id", "name", "description", "actions"];
  dataSource = new MatTableDataSource<CategoryElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  /**
   * Procedure to list all the Categories from the DB.
   */
  getCategories() {
    this.categoryService.getCategories().subscribe(
      (data: any) => {
        console.log("categories response: ", data);
        this.processCategoriesResponse(data);
      },
      (error: any) => {
        console.log("error: ", error);
      }
    );
  }

  /**
   * Method that collects a Categories List from the Java backend and uses this data
   * to build a MatTableDataSource.
   * @param resp An instance of the CategoryResponse.java from the Backend.
   */
  processCategoriesResponse(resp: any) {
    const dataCategory: CategoryElement[] = [];

    if (resp.metadata[0].code == "00") {
      let listCategory = resp.categoryResponse.categoryList;

      listCategory?.forEach((element: CategoryElement) => {
        dataCategory.push(element);
      });

      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);
      this.dataSource.paginator = this.paginator;
    }
  }

  /**
   * Procedure that opens a dialog to add a new Category.
   */
  openCategoryDialog() {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: "450px",
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar("Category added", "Success");
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar("Oops, something went wrong!", "ERROR");
      }
    });
  }

  /**
   * Procedure that opens a dialog to edit a Category.
   */
  edit(id: number, name: string, description: string) {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: "450px",
      data: { id: id, name: name, description: description },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar("Category updated", "Success");
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar("Oops, something went wrong!", "ERROR");
      }
    });
  }

  /**
   * Procedure that opens a dialog to delete a Category.
   * @param id The ID of the Category to be deleted.
   */
  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: "300px",
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar("Category deleted", "Success");
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar("Oops, something went wrong!", "ERROR");
      }
    });
  }

  /**
   * Method that opens a small panel message informing about the operation just done (add, update or
   * delete a Category, or file export).
   * @param message The informative message provided.
   * @param action The action done (addition, update, delete or file export).
   * @returns The small panel message.
   */
  openSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  /**
   * Method that finds a Category by its ID.
   * @param element The ID of the Category to be found.
   * @returns
   */
  search(element: string) {
    if (element.length === 0) {
      return this.getCategories();
    }
    this.categoryService.getCategoryById(element).subscribe((resp: any) => {
      this.processCategoriesResponse(resp);
    });
  }

  /**
   * Procedure that exports an EXCEL file with all the Categories registries from the DB.
   */
  exportExcel() {
    this.categoryService.exportCategories().subscribe(
      (data: any) => {
        let file = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet",
        });
        let fileUrl = URL.createObjectURL(file);
        var anchor = document.createElement("a");
        anchor.download = "categories.xlsx";
        anchor.href = fileUrl;
        anchor.click();
        this.openSnackBar("File successfully exported!", "Success");
      },
      (error: any) => {
        this.openSnackBar("File could not be exported.", "Error");
      }
    );
  }
}

export interface CategoryElement {
  description: string;
  id: number;
  name: string;
}
