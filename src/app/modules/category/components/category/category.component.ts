import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { NewCategoryComponent } from '../new-category/new-category.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  isAdmin: any;

  constructor(private categoryService: CategoryService,
              public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getCategories();
  }
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<CategoryElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  getCategories(){

    this.categoryService.getCategories()
        .subscribe( (data:any) => {

          console.log("Categories Response: ", data);
          this.processCategoriesResponse(data);

        }, (error: any) => {
          console.log("ERROR: ", error);
        })
  }

  processCategoriesResponse(resp: any){

    const categoryData: CategoryElement[] = [];

    if( resp.metadata[0].code == "00") {

      let categoriesList = resp.categoryResponse.category;

     categoriesList.forEach((element: CategoryElement) => {
        categoryData.push(element);
      });

      this.dataSource = new MatTableDataSource<CategoryElement>(categoryData);
      this.dataSource.paginator = this.paginator;
      
    }

  }

  openCategoryDialog(){
    const dialogRef = this.dialog.open(NewCategoryComponent , {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      
      if( result == 1){
        this.openSnackBar("Category Added.", "Success");
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar("Oops, something went wrong.", "ERROR");
      }
    });
  }

  edit(id:number, name: string, description: string){
    const dialogRef = this.dialog.open(NewCategoryComponent , {
      width: '450px',
      data: {id: id, name: name, description: description}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      
      if( result == 1){
        this.openSnackBar("Category Updated", "Success");
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar("Oops, something went wrong.", "ERROR");
      }
    });
  }

  delete(id: any){
    const dialogRef = this.dialog.open(ConfirmComponent , {
      data: {id: id, module: "category"}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      
      if( result == 1){
        this.openSnackBar("Category deleted", "Success");
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar("Oops, something went wrong.", "ERROR");
      }
    });
  }

  search( termino: string){

    if( termino.length === 0){
      return this.getCategories();
    }

    this.categoryService.getCategoryById(termino)
            .subscribe( (resp: any) => {
              this.processCategoriesResponse(resp);
            })
  }

  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action, {
      duration: 3000
    })

  }

  exportExcel(){

    this.categoryService.exportCategories()
        .subscribe( (data: any) => {
          let file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          let fileUrl = URL.createObjectURL(file);
          var anchor = document.createElement("a");
          anchor.download = "categories.xlsx";
          anchor.href = fileUrl;
          anchor.click();

          this.openSnackBar("File exported.", "Success");
        }, (error: any) =>{
          this.openSnackBar("Oops, something went wrong.", "ERROR");
        })

  }

}

export interface CategoryElement {
  description: string;
  id: number;
  name: string;
}
