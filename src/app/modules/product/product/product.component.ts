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
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getProducts();
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

  /**
   * Procedure that gets all the Products from the DB.
   */
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

  /**
   * Method that collects a Products List from the Java backend and uses this data
   * to build a MatTableDataSource.
   * @param resp An instance of the ProductResponse.java from the Backend.
   */
  processProductResponse(resp: any) {
    const productData: ProductElement[] = [];
    if (resp.metadata[0].code == "00") {
      let listCProduct = resp.productResponse.productsList;
      listCProduct?.forEach((element: ProductElement) => {
        element.picture = "data:image/jpeg;base64," + element.picture;
        productData.push(element);
      });
      this.dataSource = new MatTableDataSource<ProductElement>(productData);
      this.dataSource.paginator = this.paginator;
    }
  }

  /**
   * Procedure that opens a dialog to add a new Product.
   */
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

  /**
   * Method that opens a small panel message informing about the operation just done (add, update or
   * delete a Product, or file export).
   * @param message The informative message provided.
   * @param action The action done (addition, update, delete or file export).
   * @returns The small panel message.
   */
  openSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  /**
   * Procedure that opens a dialog to edit a Product.
   */
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

  /**
   * Procedure that opens a dialog to delete a Product.
   * @param id The ID of the Product to be deleted.
   */
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

  /**
   * Method that gets a Product by its name.
   * @param name The name of the Product to be found.
   * @returns The Product found.
   */
  search(name: any) {
    if (name.length === 0) {
      return this.getProducts();
    }
    this.productService.getProductByName(name).subscribe((resp: any) => {
      this.processProductResponse(resp);
    });
  }

  /**
   * Procedure that exports an EXCEL file with all the Product registries from the DB.
   */
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
        this.openSnackBar("File successfully exported!", "Success");
      },
      (error: any) => {
        this.openSnackBar("File could not be exported.", "Error");
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
