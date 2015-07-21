/// <reference path="../_all.ts"/>
/// <reference path="../api/api.ts" />

/**
 * Kontroller paska menu strony, 
 * pokazuje powiadomienia itp.
 */
module Shared.Controllers {
    interface IRegistrationScope extends ICtrlScope<Registration> {
        form: Form.IRegistration;
        companyUser: ICompanyUser;

        orders: IOrder[];
        totalCost: number;
        error: string;

        advanced: boolean;
    }

    export class Registration extends Controller {
        constructor(
              private $scope: IRegistrationScope
            , private $state: { params: { id?: string; orders?: string; } }
            , private api: IApi
        ) {
            super($scope, {
                  advanced: false
                , totalCost: 0
            });

            /** Pobieranie listy ofert cenowych */
            $scope.companyUser = {
                  name: ''
                , surname: ''
                , email: ''
            };
            api.Orders.get().$promise.then(data => {
                $scope.orders = data;
                $scope.form.user.orders =
                        $state.params.orders
                        ? JSON.parse(decodeURIComponent($state.params.orders))
                        : [];
            });
            $scope.form = <any> { 
                  user: { orders: [] }
                , company: { users: [], copyOrders: false }
            };

            /** 
             * Na podstawie modyfikacji listy z checkbox
             * sumują się listy
             */
            $scope.$watchCollection('form.user.orders', orders => {
                if($scope.orders)
                    $scope.totalCost = _.reduce(orders
                        , (mem, el: string) => mem + _($scope.orders).findWhere({ _id: el }).price
                        , 0)
            });
        }

        /** Pokazywanie formy rejestracyjnej firmy */
        public toggleAdvanced() {
            this.$scope.advanced = !this.$scope.advanced;
            this.$scope.form.company = <any> { users: [] };
        }

        /** getter/setter */
        private get companyUsers(): ICompanyUser[]      { return this.$scope.form.company.users;  }
        private set companyUsers(users: ICompanyUser[]) { this.$scope.form.company.users = users; }

        /**
         * Dodawanie użytkownika zarejestrowanego
         * przez firmę do formularza, użytkownik
         * musi być potem aktywowany i dopełniony
         * w rejestracji
         */
        public addCompanyUser() {
            this.companyUsers.push(_.clone(this.$scope.companyUser));
            this.$scope.companyUser = {
                  name: ''
                , surname: ''
                , email: ''
            };
        }

        /**
         * Kasowanie użytkownika z listy uczestników
         * @param {ICompanyUser} user Uczestnik zarejestrowany przez firmę
         */
        public removeCompanyUser(user: ICompanyUser) {
            this.companyUsers = _(this.companyUsers).without(user);
        }

        /**
         * Callback z serwera, czytelniej wystawić
         * to poza funkcję
         */
        private onSuccess() {
            this.$scope.error = null;
            /** TODO: przekierowanie na stronę główną */
        }
        private onError(error) { this.$scope.error = error.data; }

        /**
         * Rejestracja użytkownika wywoływana 
         * przy ng-submit w formularzu
         */
        public register() {
            this.api.Auth
                .register(this.$scope.form)
                .$promise.then(
                      this.onSuccess.bind(this)
                    , this.onError.bind(this));
        }

        /**
         * Dopełnienie rejestracji użytkownika,
         * wywoływana przy ng-submit w formie
         */
        public complete() {
            let id = this.$state.params.id;
            if(id) {
                this.api.Auth
                    .complete(<any> _(this.$scope.form).extend({id : id}))
                    .$promise.then(
                          this.onSuccess.bind(this)
                        , this.onError.bind(this));
            } else
                throw new Error('Cannot complete registration!');
        }
    }
    mod.controller('RegistrationCtrl', Registration);
}