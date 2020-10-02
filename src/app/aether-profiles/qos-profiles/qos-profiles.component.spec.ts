/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QosProfilesComponent } from './qos-profiles.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {ApiModule} from '../../../openapi3/aether/1.0.0/api.module';

describe('QosProfilesComponent', () => {
  let component: QosProfilesComponent;
  let fixture: ComponentFixture<QosProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QosProfilesComponent ],
        imports: [
            HttpClientTestingModule,
            RouterTestingModule,
            BrowserAnimationsModule,
            MatPaginatorModule,
            MatSortModule,
            MatTableModule,
            MatSnackBarModule,
            MatToolbarModule,
            ApiModule
        ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QosProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
