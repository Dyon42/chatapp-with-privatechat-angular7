import { ActivatedRoute } from "@angular/router";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { LoadingService } from "./../../servies/loading.service";
import { AuthService } from "./../../services/auth.service";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import { User } from "./../../interfaces/user";
import { Subscription } from "rxjs";
import { Rating } from "./../../interfaces/rating";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit, OnDestroy {
  public currentUser: any = null;
  public user: User;
  private subscriptions: Subscription[] = [];
  public ratingValue;
  public totalRating = 0;

  constructor(
    private auth: AuthService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private db: AngularFirestore
  ) {
    this.loadingService.isLoading.next(true);
  }

  ngOnInit() {
   

    //subscribe to the currentuser
    this.auth.currentUser.subscribe(user => {
      this.currentUser = user;
      this.loadingService.isLoading.next(false);

      //get the param dus de id van de user die je wil gaan raten 
      this.route.paramMap.subscribe(params => {
        const userId = params.get("userId");
    
        const userRef: AngularFirestoreDocument<User> = this.db.doc(
          `users/${userId}`
        );
        userRef.valueChanges().subscribe(user => (this.user = user));


        // krijg de gemiddelde rating score
        this.getTotalRating(userId).subscribe((ratings: any) => {
          this.totalRating = 0;
          //scanned het rating object of de current user al gerate heb zoja het word de berkening gemaakt met de nieuwe waarde 
          for (let rating of ratings) {
            if (this.getCurrentRating(rating.userMakingRatingId)) {
              this.ratingValue = rating.value;
            }
            this.totalRating += rating.value;
          }
          this.totalRating = this.totalRating / ratings.length;
        });
      });
    });
  }

  getTotalRating(userId) {
    const ratingRef = this.db.collection("ratings", ref =>
      ref.where("userId", "==", userId)
    );
    return ratingRef.valueChanges();
  }

  getCurrentRating(userMakingRatingId) {
    if (userMakingRatingId === this.currentUser.id) {
      return true;
    }
    return false;
  }

  setRating() {
    //the profile is
    const userId = this.user.id;
    //the logged in user
    const userMakingRatingId = this.currentUser.id;
    //the rating value 
    const value = this.ratingValue;
    const rating: Rating = { userId, userMakingRatingId, value };
     this.db.doc(`ratings/${userId}_${userMakingRatingId}`)
      .set(rating);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
