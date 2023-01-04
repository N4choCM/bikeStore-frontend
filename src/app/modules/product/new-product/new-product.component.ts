import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CategoryService } from "../../shared/services/category.service";
import { ProductService } from "../../shared/services/product.service";

export interface Category {
  description: string;
  id: number;
  name: string;
}

@Component({
  selector: "app-new-product",
  templateUrl: "./new-product.component.html",
  styleUrls: ["./new-product.component.css"],
})
export class NewProductComponent implements OnInit {
  public productForm: FormGroup;
  formStatus: string = "";
  categories: Category[] = [];
  selectedFile: any;
  nameImg: string = "";

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private dialogRef: MatDialogRef<NewProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formStatus = "Add";
    this.productForm = this.fb.group({
      name: ["", Validators.required],
      price: ["", Validators.required],
      quantity: ["", Validators.required],
      category: ["", Validators.required],
      picture: ["", Validators.required],
    });

    if (data != null) {
      this.updateForm(data);
      this.formStatus = "Update";
    }
  }

  ngOnInit(): void {
    this.getCategories();
  }

  /**
   * Procedure that establishes the logic implemented when clicking the "Save" button
   * from this Dialog view. In particular, it saves or updates a Product depending on
   * whether the Product data is null (in this case the method "saveProduct" from
   * ProductService is called) or not (in this case the method "updateProduct" from
   * ProductService is called).
   * @see ProductService
   */
  onSave() {
    let data = {
      name: this.productForm.get("name")?.value,
      price: this.productForm.get("price")?.value,
      quantity: this.productForm.get("quantity")?.value,
      category: this.productForm.get("category")?.value,
      picture: this.selectedFile,
    };

    const uploadImageData = new FormData();
    uploadImageData.append("picture", data.picture, data.picture.name);
    uploadImageData.append("name", data.name);
    uploadImageData.append("price", data.price);
    uploadImageData.append("quantity", data.quantity);
    uploadImageData.append("categoryId", data.category);

    if (this.data != null) {
      this.productService
        .updateProduct(uploadImageData, this.data.id)
        .subscribe(
          (data: any) => {
            this.dialogRef.close(1);
          },
          (error: any) => {
            this.dialogRef.close(2);
          }
        );
    } else {
      this.productService.saveProduct(uploadImageData).subscribe(
        (data: any) => {
          this.dialogRef.close(1);
        },
        (error: any) => {
          this.dialogRef.close(2);
        }
      );
    }
  }

  /**
   * Procedure that establishes the logic implemented when clicking the "Cancel" button
   * from this Dialog view.
   */
  onCancel() {
    this.dialogRef.close(3);
  }

  /**
   * Procedure that gets all the Categories from the DB (this will be used in the
   * new-product.component.html to show all the possible Categories associated to a Product
   * when the user wants to add a new Product or update an existing one).
   * @see new-product.component.html
   */
  getCategories() {
    this.categoryService.getCategories().subscribe(
      (data: any) => {
        this.categories = data.categoryResponse.categoryList;
      },
      (error: any) => {
        console.log("error when retrieving categories");
      }
    );
  }

  /**
   * Method that processes the image selected by the user to be associated to the new Product or
   * to just added new one.
   * @param event 
   */
  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
    this.nameImg = event.target.files[0].name;
  }

  /**
   * Method called from this constructor to update the data of the form of this dialog.
   * @param data The data of this form.
   */
  updateForm(data: any) {
    this.productForm = this.fb.group({
      name: [data.name, Validators.required],
      price: [data.price, Validators.required],
      quantity: [data.quantity, Validators.required],
      category: [data.category.id, Validators.required],
      picture: ["", Validators.required],
    });
  }
}
