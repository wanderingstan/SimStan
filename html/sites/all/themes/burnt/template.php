<?php

function burnt_block($block) {
  $output  = "<div class=\"block block-$block->module\" id=\"block-$block->module-$block->delta\">\n";
  //don't print the header if it's the navigation block
  if (!($block->module == 'user' && $block->delta == '1')) {
    $output .= " <h2 class=\"title\">$block->subject</h2>\n";
  };
  $output .= " <div class=\"content\">$block->content</div>\n";
  $output .= "</div>\n";
  return $output;
}
/* Checks to see if we're in the admin section */
function burnt_is_admin() {
  if (((arg(0) == 'admin') || (arg(0) == 'sadmin')) && (user_access('access administration pages'))) {
    return true;
  }
}
