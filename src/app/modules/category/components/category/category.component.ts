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

  getCategories() {
    this.categoryService.getCategories().subscribe(
      (data: any) => {
        console.log("respuesta categories: ", data);
        this.processCategoriesResponse(data);
      },
      (error: any) => {
        console.log("error: ", error);
      }
    );
  }

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

  openSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  search(element: string) {
    if (element.length === 0) {
      return this.getCategories();
    }

    this.categoryService.getCategoryById(element).subscribe((resp: any) => {
      this.processCategoriesResponse(resp);
    });
  }
}

export interface CategoryElement {
  description: string;
  id: number;
  name: string;
}
