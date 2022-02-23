/*
 * SPDX-FileCopyrightText: 2021-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ConnectivityServicesConnectivityService } from '../../../openapi3/aether/2.0.0/models';
import { Service as AetherService } from '../../../openapi3/aether/2.0.0/services';
import { ConnectivityServiceDatasource } from './connectivity-service-datasource';
import { AETHER_TARGET } from '../../../environments/environment';
import { BasketService } from '../../basket.service';
import { RocListBase } from '../../roc-list-base';
import { OpenPolicyAgentService } from '../../open-policy-agent.service';
import * as _ from 'lodash';

@Component({
    selector: 'aether-connectivity-service',
    templateUrl: './connectivity-service.component.html',
    styleUrls: ['../../common-profiles.component.scss'],
})
export class ConnectivityServiceComponent
    extends RocListBase<
        ConnectivityServiceDatasource,
        ConnectivityServicesConnectivityService
    >
    implements AfterViewInit
{
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable)
    table: MatTable<ConnectivityServicesConnectivityService>;

    /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
    displayedColumns = [
        'id',
        'description',
        'core-5g-endpoint',
        'edit',
        'Usage/delete',
    ];

    constructor(
        private aetherService: AetherService,
        private basketService: BasketService,
        public opaService: OpenPolicyAgentService
    ) {
        super(
            basketService,
            new ConnectivityServiceDatasource(
                aetherService,
                basketService,
                AETHER_TARGET
            )
        );
    }

    onDataLoaded(ScopeOfDataSource: ConnectivityServiceDatasource): void {
        /* TODO: Needs work*/
        // const basketPreview = ScopeOfDataSource.bs.buildPatchBody().Updates;
        // this.usageArray = [];
        // this.aetherService
        //     .getEnterprise({
        //         target: AETHER_TARGET,
        //     })
        //     .subscribe((displayData) => {
        //         this.usageArray = this.usageArray.concat(
        //             _.differenceWith(
        //                 ScopeOfDataSource.data,
        //                 displayData.enterprise,
        //                 function (ScopeOfDataSourceObject, displayDataObject) {
        //                     return _.findIndex(
        //                         displayDataObject['connectivity-service'],
        //                         (filterElement) => {
        //                             return (
        //                                 filterElement['connectivity-service'] ==
        //                                 ScopeOfDataSourceObject.id
        //                             );
        //                         }
        //                     ) !== -1
        //                         ? true
        //                         : false;
        //                 }
        //             )
        //         );
        //     });
        // if (
        //     this.pathRoot in basketPreview &&
        //     'connectivity-service' in basketPreview[this.pathRoot]
        // ) {
        //     ScopeOfDataSource.merge(
        //         basketPreview['Connectivity-services-2.0.0'][
        //             'connectivity-service'
        //         ]
        //     );
        // }
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.table.dataSource = this.dataSource;
        this.dataSource.loadData(
            this.aetherService.getConnectivityServices({
                target: AETHER_TARGET,
            }),
            this.onDataLoaded.bind(this)
        );
    }
}
