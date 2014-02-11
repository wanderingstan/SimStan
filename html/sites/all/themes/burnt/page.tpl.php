<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="<?php print $language->language ?>" xml:lang="<?php print $language->language ?>">

  <head>
    <title><?php print $head_title ?></title>
    <meta http-equiv="Content-Style-Type" content="text/css" />
    <?php print $head ?>
    <?php print $styles ?>
    <?php print $scripts ?>
    <script type="text/javascript"><?php /* Needed to avoid Flash of Unstyle Content in IE */ ?> </script>
  </head>

<body>
<div id="container">
	<div id="header">
    <?php
      global $user;
      if ($user->uid > 0) {
      	?>
        <div class="simstan-current-user-div"><a href="/user/<?=$user->uid?>"><img src="/<?=$user->picture?>"/><?=$user->name?></a></div>
        <?
      }
    ?>
    <?php if ($site_name) { ?><h1 class='site-name'><a href="<?php print $base_path ?>" title="<?php print t('Home') ?>"><?php print $site_name ?></a></h1><?php } ?>
      <?php if ($site_slogan) { ?><div class="slogan"><?php print $site_slogan ?></div><?php } ?>
    	 
      <?php if ($search_box) { print $search_box; } ?>
      <?php if (isset($primary_links)) { ?><?php print theme('links', $primary_links, array('class' =>'links', 'id' => 'navlist')) ?><?php } ?>
      <?php if (isset($secondary_links)) { ?><?php print theme('links', $secondary_links, array('class' =>'links', 'id' => 'subnavlist')) ?><?php } ?>
	</div>

  <?php if ($left) { ?>
	  <div id="sidebar-left">
      <?php print $left ?>
      <?php if (($right) && (burnt_is_admin())) { ?>
        <?php print $right ?>
      <?php } ?>
    </div>
  <?php } ?>

 	<div id="content" <?php if (burnt_is_admin()) { ?>class="admin"<?php } ?>>
    <?php /* print $breadcrumb */ ?>
    <?php if ($mission) { ?><div id="mission"><?php print $mission ?></div><?php } ?>
    <?php print $help ?>
    <?php print $messages ?>
    <h1 class="title"><?php print $title ?></h1>
    <div class="tabs"><?php print $tabs ?></div>
    <?php print $content; ?>
  </div>

  <?php if (($right) && (!burnt_is_admin())) { ?>
	  <div id="sidebar-right">
      <?php print $right ?>
    </div>
  <?php } ?>

	  
	<div id="footer">
      <p><?php print $footer_message ?>
    </div>
    <?php print $closure ?></p>

</div>

</body>
</html>

