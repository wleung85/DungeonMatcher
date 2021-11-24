import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faDragon } from '@fortawesome/free-solid-svg-icons';
import './lfgSecondarySideBar.css';
import SimpleBarReact from "simplebar-react";
import "simplebar/src/simplebar.css";

export default function LfgSideBar() {
  return (
    <div className="sidebar-secondary lfgsb">
      <div className="sidebar-secondary-content">
        <div className="lfgsb-search-for">
          <h3>Search for:</h3>
          <button>
            <FontAwesomeIcon icon={faUserPlus} />
          </button>
          <button>
            <FontAwesomeIcon icon={faDragon} />
          </button>
        </div>
        <div className="lfgsb-search-as">
          <h3>Search as:</h3>
          <SimpleBarReact style={{ maxHeight: '500px' }}>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tincidunt ut sapien sed ultricies. Nunc a porta elit, ut luctus sem. Curabitur lacinia ut lectus a feugiat. Nulla vitae gravida sem. Curabitur nulla mi, lobortis nec egestas sollicitudin, finibus ac sapien. Curabitur quis consectetur mi, in mollis nisi. In quis arcu id augue lacinia facilisis.

In hac habitasse platea dictumst. Mauris semper feugiat elit in imperdiet. Ut dapibus nec nunc in venenatis. Maecenas viverra leo ut ligula ultrices rhoncus. Integer euismod lorem sed sem imperdiet, ut dapibus orci maximus. Vestibulum fermentum molestie malesuada. Nunc efficitur, neque eu imperdiet suscipit, turpis felis eleifend nisl, ut dignissim orci sapien ut mauris. Donec eu consectetur nisl, eu hendrerit mi. Integer nec felis vitae enim cursus imperdiet. Sed in erat viverra erat vehicula blandit vel volutpat ipsum. Integer massa quam, fermentum id sapien vel, mattis euismod purus. Suspendisse ut libero semper, vestibulum nunc sed, tincidunt purus.

Proin id faucibus dui. Maecenas dignissim placerat odio et dapibus. Integer in nulla vitae erat lacinia malesuada eu quis nunc. Aliquam erat volutpat. Curabitur vestibulum, turpis non vestibulum venenatis, justo odio interdum urna, non vestibulum odio lacus a elit. Maecenas commodo libero dolor, ut congue metus imperdiet et. Vestibulum pellentesque ligula non nunc vulputate sagittis. In hac habitasse platea dictumst. Nam in risus arcu. Mauris et felis ac augue dictum iaculis. Maecenas tempor, tortor a aliquet rhoncus, diam felis tristique justo, nec posuere nulla enim nec sem. Nam ut elementum leo. Nunc quis nunc dapibus, hendrerit metus non, posuere urna. In nec turpis sodales purus commodo lobortis sed eu lectus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce eget ipsum ultrices, bibendum dolor ut, rhoncus orci.

Quisque eget consectetur ipsum. Fusce lectus erat, volutpat in dictum eu, accumsan scelerisque odio. Nunc vitae ligula tortor. Curabitur consequat, odio eget congue tempus, enim erat pulvinar nisi, eget ultrices dui eros et elit. Maecenas in malesuada orci, vel fermentum mi. Vestibulum quis volutpat neque. Maecenas id feugiat risus. Nam sit amet nisi interdum, euismod justo at, auctor urna. Fusce sed gravida felis, ac porttitor neque. Suspendisse aliquam fermentum leo et tincidunt. Morbi eget velit at leo accumsan condimentum. Aenean eu elit elementum, maximus arcu eget, scelerisque libero. Praesent in vulputate orci. Vivamus sodales eget leo id malesuada. In mollis erat at risus hendrerit, quis ultrices odio scelerisque.

Sed sem sapien, fringilla eget nisi et, vulputate egestas odio. Vivamus varius auctor ligula, lobortis aliquam risus vehicula non. Nam et erat gravida, congue purus vel, condimentum tortor. Nam fringilla eleifend diam, vitae viverra urna. Etiam sodales, tellus sed condimentum tincidunt, neque leo gravida turpis, non vulputate nulla urna vitae velit. Donec auctor neque sapien, eu ultrices purus congue id. In a massa efficitur turpis rutrum placerat. Fusce et consequat ante, vel euismod eros. Proin ultricies porta massa ut feugiat. Integer eget lacus nunc. Sed placerat tellus mattis dui consequat maximus tincidunt ac justo. Donec semper, enim ac faucibus fringilla, urna eros laoreet erat, vel ornare nunc enim in erat. In congue purus at risus tincidunt, ut dignissim augue euismod.</p>
          </SimpleBarReact>
        </div>
      </div>
    </div>
  );
}
