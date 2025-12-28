import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import LOGIN from "../../components/LOGIN/FormLogin.jsx";

export default function login_page() {
  return (
    <div class="h-dvh">
      <div class="flex flex-row ">
        <div class="flex flex-grow">
          <div class="xl:relative xl:w-full xl:h-dvh xl:bg-no-repeat xl:bg-cover xl:bg-position-[center_right_25rem] xl:bg-[image:var(--logo)] xl:opacity-30 lg:bg-[image:var(--logo)]" style={{ "--logo": `url(${logo})` }}></div>
        </div>
        <div class="flex flex-row">
          <hr />
        </div>
        <div class="flex-grow-0 mt-20 xl:mr-40 xl:mt-25 lg:mr-40 lg:mt-25 md:mr-40 md:mt-25 sm:mr-15 sm:mt-25">
          <LOGIN />
        </div>
      </div>
    </div>
  );
}

