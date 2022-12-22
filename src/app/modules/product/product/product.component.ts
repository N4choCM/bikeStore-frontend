import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { ConfirmComponent } from "../../shared/components/confirm/confirm.component";
import { ProductService } from "../../shared/services/product.service";
import { UtilService } from "../../shared/services/util.service";
import { NewProductComponent } from "../new-product/new-product.component";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.css"],
})
export class ProductComponent implements OnInit {
  isAdmin: any;

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private util: UtilService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.isAdmin = this.util.isAdmin();
  }

  displayedColumns: string[] = [
    "id",
    "name",
    "price",
    "quantity",
    "category",
    "picture",
    "actions",
  ];
  dataSource = new MatTableDataSource<ProductElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  getProducts() {
    this.productService.getProducts().subscribe(
      (data: any) => {
        console.log("products response: ", data);
        this.processProductResponse(data);
      },
      (error: any) => {
        console.log("error in products: ", error);
      }
    );
  }

  processProductResponse(resp: any) {
    const productData: ProductElement[] = [];
    if (resp.metadata[0].code == "00") {
      let listCProduct = resp.productResponse.productsList;

      listCProduct?.forEach((element: ProductElement) => {
        //element.category = element.category.name;
        element.picture = "data:image/jpeg;base64," + element.picture;
        productData.push(element);
      });

      //set the datasource
      this.dataSource = new MatTableDataSource<ProductElement>(productData);
      this.dataSource.paginator = this.paginator;
    }
  }

  openProductDialog() {
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: "450px",
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar("Product Added.", "Success");
        this.getProducts();
      } else if (result == 2) {
        this.openSnackBar("Oops, something went wrong.", "ERROR");
      }
    });
  }

  openSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  edit(
    id: number,
    name: string,
    price: number,
    quantity: number,
    category: any
  ) {
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: "450px",
      data: {
        id: id,
        name: name,
        price: price,
        quantity: quantity,
        category: category,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar("Product Updated", "Success");
        this.getProducts();
      } else if (result == 2) {
        this.openSnackBar("Oops, something went wrong.", "ERROR");
      }
    });
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: "450px",
      data: { id: id, module: "product" },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar("Product Deleted.", "Success");
        this.getProducts();
      } else if (result == 2) {
        this.openSnackBar("Oops, something went wrong.", "ERROR");
      }
    });
  }

  search(name: any) {
    if (name.length === 0) {
      return this.getProducts();
    }

    this.productService.getProductByName(name).subscribe((resp: any) => {
      this.processProductResponse(resp);
    });
  }

  exportExcel() {
    this.productService.exportProduct().subscribe(
      (data: any) => {
        let file = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        let fileUrl = URL.createObjectURL(file);
        var anchor = document.createElement("a");
        anchor.download = "products.xlsx";
        anchor.href = fileUrl;
        anchor.click();

        this.openSnackBar("File successfully eported!", "Success")
      }, (error: any) => {
        this.openSnackBar("File could not be exported.", "Error")
      }
    );
  }
}

export interface ProductElement {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: any;
  picture: any;
}
