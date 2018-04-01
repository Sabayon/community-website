+++
+++

{{< disclaimer >}}

To install this package you have to enable the
`<span class="repository"></span>`
repository available in **SCR**.

1. **First, be sure to have weekly repositories disabled and main installed:**

        sudo mv /etc/entropy/repositories.conf.d/entropy_sabayonlinux.org{.example,}
        sudo equo repo disable sabayon-weekly
        sudo equo repo enable sabayonlinux.org

1. **Install `enman`, the Entropy repository manager and add the repository:
   (skip, if you have already added this repository)**

        sudo equo i enman
        sudo enman add <span class="repository"></span>

1. **Now let's upgrade the Entropy database and install the package:**

        sudo equo up
        sudo equo install <span class="package"></span>
