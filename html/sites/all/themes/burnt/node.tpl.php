<div class="node<?php print ($sticky) ? " sticky" : ""; ?>">
  <?php if ($page == 0): ?>
    <h2><a href="<?php print $node_url ?>" title="<?php print $title ?>"><?php print $title ?></a></h2>
  <?php else: ?>
    <?php print $picture ?>
    <em class="info">
      <?php
        print '<b>' . theme('username', $node) . '</b>  ' . format_date($node->created, 'custom', 'Y-m-d');
      ?>
    </em>
  <?php endif; ?>
  <div class="content">
   <?php print $content ?>
  </div>
  <?php if ($links): ?>
    <em class="clear links"><?php print $links ?></em>
  <?php endif; ?>
  <?php if ($page == 1): ?>
    <em class="clear terms"><?php print $terms ?></em>
  <?php endif; ?>
</div>
