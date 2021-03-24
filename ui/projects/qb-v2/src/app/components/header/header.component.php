<nav class="navbar navbar-expand-lg navbar-dark bg-default sticky-top">
  <div class="container-fluid">
    <a class="navbar-brand text-capitalize d-flex align-items-center" [routerLink]="['']"><i
        class="fas fa-clone display-4 mr-3"></i> Query Builder Version 2</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-default"
      aria-controls="navbar-default" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <ul class="navbar-nav ml-auto">
      <li ngbDropdown class="nav-item dropdown" [class.show]="expanded">
        <a ngbDropdownToggle class="nav-link dropdown-toggle" id="navbardrop">
          <i class="fas fa-bars fa-lg"></i>
        </a>
        <div ngbDropdownMenu class="dropdown-menu dropdown-menu-right">
          <button ngbDropdownItem (click)="manageQueries()">
            <i class="fas fa-cog"></i> Manage Queries
          </button>
          <button ngbDropdownItem (click)="createNewQuery()">
            <i class="fas fa-plus"></i> Create New Query
          </button>
          <a ngbDropdownItem href="http://localhost:9005/" target="_blank">
            <i class="fas fa-file-code"></i> Code Documentation
          </a>
          <button ngbDropdownItem>
            <i class="fa fa-bug" aria-hidden="true"></i> Issues
          </button>
        </div>
      </li>
    </ul>
  </div>
</nav>