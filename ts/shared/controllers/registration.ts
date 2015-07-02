/// <reference path="../api/api.ts" />

/**
 * Kontroller paska menu strony, 
 * pokazuje powiadomienia itp.
 */
module Shared.Controllers {
    interface IRegistrationScope extends ICtrlScope<Registration> {
        form: IRegistrationForm;
        companyUser: ICompanyUser;

        orders: IOrder[];
        totalCost: number;
        error: string;
    };

    export class Registration {
        constructor(
              private $scope: IRegistrationScope
            , private api: IApi
        ) {
            $scope.fn = this;

            /** Pobieranie listy ofert cenowych */
            api.Orders.list().$promise.then(data => {
                $scope.orders = data;
            });
            $scope.form = <any> { 
                  user: { orders: [] }
                , company: { users: [] }
            };

            /** 
             * Na podstawie modyfikacji listy z checkbox
             * sumują się listy
             */
            $scope.totalCost = 0;
            $scope.$watchCollection('form.user.orders', function(o) {
                $scope.totalCost = _.reduce($scope.form.user.orders
                    , (mem, el: IOrder) => mem + el.price
                    , 0)
            });
        };

        /** getter/setter */
        private get companyUsers(): ICompanyUser[]      { return this.$scope.form.company.users; };
        private set companyUsers(users: ICompanyUser[]) { this.$scope.form.company.users = users; };

        /**
         * Dodawanie użytkownika zarejestrowanego
         * przez firmę do formularza, użytkownik
         * musi być potem aktywowany i dopełniony
         * w rejestracji
         */
        public addCompanyUser() {
            this.companyUsers.push(_.clone(this.$scope.companyUser));
        };

        /**
         * Kasowanie użytkownika z listy uczestników
         * @param {ICompanyUser} user Uczestnik zarejestrowany przez firmę
         */
        public removeCompanyUser(user: ICompanyUser) {
            this.companyUsers = _(this.companyUsers).without(user);
        };

        /**
         * Callback z serwera, czytelniej wystawić
         * to poza funkcję
         */
        private onError(error) {
            this.$scope.error = error.data;
            /** TODO: jakieś animacje itp. */
        };

        /**
         * Rejestracja użytkownika wywoływana 
         * przy ng-submit w formularzu
         */
        public register() {
            this.api.User
                .register(this.$scope.form)
                .$promise.then(() => {
                    /** TODO: routing do strony głównej */
                }, this.onError.bind(this));
        };
    };
};