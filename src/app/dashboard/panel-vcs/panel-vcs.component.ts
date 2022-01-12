/*
 * SPDX-FileCopyrightText: 2021-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */
import {
    AfterViewInit,
    Component,
    Inject,
    Input,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Vcs, VcsVcs } from '../../../openapi3/aether/4.0.0/models';
import { RocListBase } from '../../roc-list-base';
import {
    AETHER_TARGETS,
    PERFORMANCE_METRICS_ENABLED,
} from '../../../environments/environment';
import { OpenPolicyAgentService } from '../../open-policy-agent.service';
import { Service as AetherService } from '../../../openapi3/aether/4.0.0/services/service';
import { BasketService } from '../../basket.service';
import { PanelVcsDatasource } from './panel-vcs-datasource';
import { VcsPromDataSource } from '../../utils/vcs-prom-data-source';
import { HttpClient } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { IdTokClaims } from '../../idtoken';
import { RocDataSource } from '../../roc-data-source';

const vcsPromTags = ['vcs_active', 'vcs_inactive', 'vcs_idle'];

@Component({
    selector: 'aether-panel-vcs',
    templateUrl: './panel-vcs.component.html',
    styleUrls: [
        '../../common-panel.component.scss',
        '../panel-dashboard.component.scss',
    ],
})
export class PanelVcsComponent
    extends RocListBase<PanelVcsDatasource>
    implements AfterViewInit, OnDestroy
{
    @Input() top: number;
    @Input() left: number;
    @Input() width: number;
    @Input() height: number;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<VcsVcs>;
    loginTokenTimer: any;
    panelUrl: string;
    grafanaOrgId: number = 1;
    grafanaOrgName: string;
    promData: VcsPromDataSource;

    performanceMetricsEnabled: boolean = PERFORMANCE_METRICS_ENABLED;

    displayedColumns = [
        'id',
        'description',
        'active',
        'inactive',
        'idle',
        'monitor',
    ];

    constructor(
        public opaService: OpenPolicyAgentService,
        private aetherService: AetherService,
        private basketService: BasketService,
        private httpClient: HttpClient,
        private oauthService: OAuthService,
        @Inject('grafana_api_proxy') private grafanaUrl: string
    ) {
        super(
            basketService,
            new PanelVcsDatasource(
                aetherService,
                basketService,
                AETHER_TARGETS[0]
            ),
            'Vcs-4.0.0',
            'vcs'
        );
        super.reqdAttr = ['sd', 'traffic-class', 'sst', 'enterprise'];
        this.promData = new VcsPromDataSource(httpClient);
    }

    onDataLoaded(ScopeOfDataSource: RocDataSource<VcsVcs, Vcs>): void {
        ScopeOfDataSource.data.forEach((vcs: VcsVcs) => {
            // Add the tag on to VCS. the data is filled in below
            vcsPromTags.forEach((tag: string) => (vcs[tag] = {}));
        });
        console.log('VCS Data Loaded');
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.table.dataSource = this.dataSource;

        this.loginTokenTimer = setInterval(() => {
            if(this.oauthService.hasValidIdToken()) {
                const claims =
                    this.oauthService.getIdentityClaims() as IdTokClaims;
                // TODO: enhance this - it takes the last group, having all lower case as the Grafana Org.
                this.grafanaOrgName = claims.groups.find(
                    (g) => g === g.toLowerCase()
                );
                this.panelUrl = this.vcsPanelUrl(
                    this.grafanaOrgId,
                    this.grafanaOrgName
                );

                clearInterval(this.loginTokenTimer);
            }
        }, 10);

        this.dataSource.loadData(
            this.aetherService.getVcs({
                target: AETHER_TARGETS[0],
            }),
            this.onDataLoaded.bind(this)
        );
    }

    ngOnDestroy(): void {
        clearInterval(this.loginTokenTimer);
    }

    vcsPanelUrl(orgId: number, orgName: string, vcsName?: string): string {
        if (vcsName === undefined) {
            return (
                this.grafanaUrl +
                '/d-solo/vcs-' +
                orgName +
                '-all?orgId=' +
                orgId +
                '&theme=light&panelId=1'
            );
        }
        return (
            this.grafanaUrl +
            '/d-solo/vcs-' +
            vcsName +
            '?orgId=' +
            orgId +
            '&theme=light&panelId=1'
        );
    }
}
